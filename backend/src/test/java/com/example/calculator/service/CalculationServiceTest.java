package com.example.calculator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.calculator.dto.CalculationRequest;
import com.example.calculator.dto.CalculationResponse;
import com.example.calculator.model.Calculation;
import com.example.calculator.model.OperationType;
import com.example.calculator.repository.CalculationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CalculationServiceTest {

    @Mock
    private CalculationRepository repository;

    @InjectMocks
    private CalculationService service;

    @Test
    void createComputesModuloAndPersistsOperationType() {
        when(repository.save(any(Calculation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CalculationRequest request = new CalculationRequest();
        request.setFirstNumber(14d);
        request.setSecondNumber(4d);
        request.setOperation("mod");

        CalculationResponse response = service.create(request);
        ArgumentCaptor<Calculation> calculationCaptor = ArgumentCaptor.forClass(Calculation.class);

        verify(repository).save(calculationCaptor.capture());

        assertThat(response.getResult()).isEqualTo(2d);
        assertThat(response.getOperation()).isEqualTo("mod");
        assertThat(calculationCaptor.getValue().getOperation()).isEqualTo(OperationType.MOD);
    }

    @Test
    void createRejectsModuloByZero() {
        CalculationRequest request = new CalculationRequest();
        request.setFirstNumber(14d);
        request.setSecondNumber(0d);
        request.setOperation("mod");

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Cannot mod by zero");

        verify(repository, never()).save(any(Calculation.class));
    }
}
