package com.example.calculator.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "operations")
public class Calculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_number", nullable = false)
    private double firstNumber;

    @Column(name = "second_number", nullable = false)
    private double secondNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "operand", nullable = false)
    private OperationType operation;

    @Column(name = "result", nullable = false)
    private double result;

    protected Calculation() {
    }

    public Calculation(double firstNumber, double secondNumber, OperationType operation, double result) {
        this.firstNumber = firstNumber;
        this.secondNumber = secondNumber;
        this.operation = operation;
        this.result = result;
    }

    public Long getId() {
        return id;
    }

    public double getFirstNumber() {
        return firstNumber;
    }

    public double getSecondNumber() {
        return secondNumber;
    }

    public void setFirstNumber(double firstNumber) {
        this.firstNumber = firstNumber;
    }

    public void setSecondNumber(double secondNumber) {
        this.secondNumber = secondNumber;
    }

    public void setOperation(OperationType operation) {
        this.operation = operation;
    }

    public void setResult(double result) {
        this.result = result;
    }

    public OperationType getOperation() {
        return operation;
    }

    public double getResult() {
        return result;
    }
}
