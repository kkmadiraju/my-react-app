package com.example.calculator.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaInitializer {

    private static final String CREATE_OPERATIONS_TABLE = """
        IF NOT EXISTS (
            SELECT 1
            FROM sys.tables
            WHERE name = N'operations' AND schema_id = SCHEMA_ID(N'dbo')
        )
        BEGIN
                CREATE TABLE dbo.operations (
                id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                first_number FLOAT NOT NULL,
                second_number FLOAT NOT NULL,
                operand NVARCHAR(20) NOT NULL,
                result FLOAT NOT NULL
            )
        END
    """;

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initializeSchema() {
        jdbcTemplate.execute(CREATE_OPERATIONS_TABLE);
    }
}
