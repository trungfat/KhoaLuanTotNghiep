package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Min;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "import_product")
@Getter
@Setter
public class ImportProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Date importDate;

    private Time importTime;

    @Min(1)
    private Integer quantity;

    private Double importPrice;

    private String description;

    @Transient
    private String colorName;

    @Transient
    private String productName;

    @ManyToOne
    @JoinColumn(name = "product_size_id")
    private ProductSize productSize;
}
