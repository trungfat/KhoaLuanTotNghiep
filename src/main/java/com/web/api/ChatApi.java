package com.web.api;

import com.web.dto.response.ChatDto;
import com.web.entity.Chatting;
import com.web.entity.User;
import com.web.repository.ChatRepository;
import com.web.repository.UserRepository;
import com.web.servive.UserService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatApi {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserUtils userUtils;

    @GetMapping("/user/my-chat")
    public ResponseEntity<?> myChat(){
        List<Chatting> result = chatRepository.myChat(userUtils.getUserWithAuthority().getId());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/getAllUserChat")
    public ResponseEntity<?> getAllUserChat(@RequestParam(value = "search", required = false) String search){
        if(search == null){
            search = "";
        }
        search = "%"+search +"%";
        Set<User> list = chatRepository.getAllUserChat(search);
        Set<ChatDto> chatDtoList = new HashSet<>();
        for(User u : list){
            Chatting chatting = chatRepository.findLastChatting(u.getId());
            if(chatting != null){
                ChatDto chatDto = new ChatDto(u,chatting.getContent(),calculateTime(chatting.getCreatedDate()), chatting.getCreatedDate()," ");
                chatDtoList.add(chatDto);
            }
            else{
                ChatDto chatDto = new ChatDto(u,"","0 min", new Timestamp(System.currentTimeMillis())," ");
                chatDtoList.add(chatDto);
            }
        }
        return new ResponseEntity<>(chatDtoList, HttpStatus.OK);
    }

    @GetMapping("/admin/getListChat")
    public List<Chatting> getListChat(@RequestParam("idreciver") Long idreciver){
        return chatRepository.findByUser(idreciver);
    }


    public void sort(ArrayList<ChatDto> sub) {
        Collections.sort(sub, new Comparator<ChatDto>() {
            @Override
            public int compare(ChatDto o1, ChatDto o2) {
                return o2.getTimestamp().compareTo(o1.getTimestamp());
            }
        });
    }

    public String calculateTime(Timestamp t){
        Long now = System.currentTimeMillis();
        Long end = now - t.getTime();
        if(end/1000/60 < 1){
            return "1 min";
        }
        else if(end/1000/60 >= 1 && end/1000/60 < 60){
            Integer x = Math.toIntExact(end / 1000 / 60);
            return x.toString()+" min";
        }
        else if(end/1000/60/60 >= 1 && end/1000/60/60 < 24){
            Integer x = Math.toIntExact(end / 1000 / 60 / 60);
            return x.toString() + " hour";
        }
        else if(end/1000/60/60/24 >= 1){
            Integer x = Math.toIntExact(end / 1000 / 60 / 60 / 24);
            return x.toString() + " day";
        }
        return "0 min";
    }
}
