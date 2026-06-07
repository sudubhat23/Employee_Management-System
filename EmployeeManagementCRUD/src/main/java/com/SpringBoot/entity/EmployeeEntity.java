package com.SpringBoot.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class EmployeeEntity {
	
	    @Id
	    @GeneratedValue(strategy=GenerationType.IDENTITY)
	    private Integer id;

	    private String name;

	    private Integer age;

	    private String dept;

		public EmployeeEntity() {
			super();
			// TODO Auto-generated constructor stub
		}

		public EmployeeEntity(Integer id, String name, Integer age, String dept) {
			super();
			this.id = id;
			this.name = name;
			this.age = age;
			this.dept = dept;
		}

		public int getId() {
			return id;
		}

		public void setId(Integer id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public int getAge() {
			return age;
		}

		public void setAge(Integer age) {
			this.age = age;
		}

		public String getDept() {
			return dept;
		}

		public void setDept(String dept) {
			this.dept = dept;
		}

		@Override
		public String toString() {
			return "EmployeeEntity [id=" + id + ", name=" + name + ", age=" + age + ", dept=" + dept + "]";
		}

	   
}
