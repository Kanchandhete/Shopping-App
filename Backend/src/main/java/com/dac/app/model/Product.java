package com.dac.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class Product {
	private int prodId;
	private String prodName;
	private int price;
}
