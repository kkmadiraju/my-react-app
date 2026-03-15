package com.example.calculator.service;

import com.example.calculator.dto.CalculationRequest;
import com.example.calculator.dto.CalculationResponse;
import com.example.calculator.exception.ResourceNotFoundException;
import com.example.calculator.model.Calculation;
import com.example.calculator.model.OperationType;
import com.example.calculator.repository.CalculationRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CalculationService {

    private final CalculationRepository repository;

    public CalculationService(CalculationRepository repository) {
        this.repository = repository;
    }

    public CalculationResponse create(CalculationRequest request) {
        return new CalculationResponse(repository.save(compute(request)));
    }

    @Transactional(readOnly = true)
    public List<CalculationResponse> getAll() {
        return repository.findAll().stream()
                .map(CalculationResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CalculationResponse getById(Long id) {
        return repository.findById(id)
                .map(CalculationResponse::new)
                .orElseThrow(() -> new ResourceNotFoundException("Calculation with id " + id + " was not found"));
    }

    public CalculationResponse update(Long id, CalculationRequest request) {
        Calculation calculation = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calculation with id " + id + " was not found"));

        calculation.setFirstNumber(request.getFirstNumber());
        calculation.setSecondNumber(request.getSecondNumber());
        calculation.setOperation(OperationType.fromValue(request.getOperation()));
        calculation.setResult(compute(request).getResult());

        return new CalculationResponse(repository.save(calculation));
    }

    @Transactional
    public void delete(Long id) {
        Calculation calculation = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calculation with id " + id + " was not found"));
        repository.delete(calculation);
    }

    private Calculation compute(CalculationRequest request) {
        OperationType operation = OperationType.fromValue(request.getOperation());
        double result = switch (operation) {
            case ADD -> request.getFirstNumber() + request.getSecondNumber();
            case SUBTRACT -> request.getFirstNumber() - request.getSecondNumber();
            case MULTIPLY -> request.getFirstNumber() * request.getSecondNumber();
            case DIVIDE -> {
                if (request.getSecondNumber() == 0d) {
                    throw new IllegalArgumentException("Cannot divide by zero");
                }
                yield request.getFirstNumber() / request.getSecondNumber();
            }
        };

        return new Calculation(request.getFirstNumber(), request.getSecondNumber(), operation, result);
    }
}
