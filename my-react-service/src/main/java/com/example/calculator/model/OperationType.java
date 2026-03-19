package com.example.calculator.model;

public enum OperationType {
    ADD("add"),
    SUBTRACT("subtract"),
    MULTIPLY("multiply"),
    DIVIDE("divide"),
    MOD("mod");

    private final String value;

    OperationType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static OperationType fromValue(String value) {
        for (OperationType type : values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }

        throw new IllegalArgumentException("Unsupported operation: " + value);
    }
}
