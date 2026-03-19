package com.example.calculator.dto;

import com.example.calculator.model.Calculation;

public class CalculationResponse {

    private Long id;
    private double firstNumber;
    private double secondNumber;
    private String operation;
    private double result;

    public CalculationResponse() {
    }

    public CalculationResponse(Calculation calculation) {
        this.id = calculation.getId();
        this.firstNumber = calculation.getFirstNumber();
        this.secondNumber = calculation.getSecondNumber();
        this.operation = calculation.getOperation().getValue();
        this.result = calculation.getResult();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getFirstNumber() {
        return firstNumber;
    }

    public void setFirstNumber(double firstNumber) {
        this.firstNumber = firstNumber;
    }

    public double getSecondNumber() {
        return secondNumber;
    }

    public void setSecondNumber(double secondNumber) {
        this.secondNumber = secondNumber;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public double getResult() {
        return result;
    }

    public void setResult(double result) {
        this.result = result;
    }
}
