package com.internship.tool.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetPageReturns200() throws Exception {
        mockMvc.perform(get("/api/page?page=0&size=5"))
               .andExpect(status().isOk());
    }

    @Test
    public void testSearchReturns200() throws Exception {
        mockMvc.perform(get("/api/search?q=test&page=0&size=5"))
               .andExpect(status().isOk());
    }
}
