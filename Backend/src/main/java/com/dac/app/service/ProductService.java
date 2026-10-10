package com.dac.app.service;

import java.util.ArrayList;


import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dac.app.model.Product;

@Service
public class ProductService {
	
	
	List<Product> products = new ArrayList<> (Arrays.asList(
			new Product(101, "IPhone", 50000), 
			new Product(102, "Camera", 60000),
			new Product(103, "Laptop", 70000)));
	
	
	public List<Product> getProducts(){
		return products;
	}
	

	public Product getProductById(int prodId) {
		
		for(Product p : products) {
			if(p.getProdId() == prodId) {
				return p;
			}		
		}
		return null;
	}
	
	public void addProduct(Product prod) {
		products.add(prod);
	}


	public void updateProduct(Product prod) {
		int index = 0;
		for(int i=0; i<products.size(); i++) {
			if(products.get(i).getProdId() == prod.getProdId()) {
				index = i;
			}
		}
		products.set(index, prod);
	}


	public void deleteProductById(int prodId) {
		int index = 0;
		for(int i=0; i<products.size(); i++) {
			if(products.get(i).getProdId() == prodId) {
				index = i;
			}
		}
		products.remove(index);
		
	}
	
}

