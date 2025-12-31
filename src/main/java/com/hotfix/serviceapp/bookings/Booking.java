package com.hotfix.serviceapp.bookings;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.hotfix.serviceapp.jobs.Job;
import com.hotfix.serviceapp.users.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;


    @OneToOne
    @JsonBackReference
    private Job job;

    @ManyToOne
    private User tradesman;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;


    public void setJob(Job job) {
        this.job = job;
    }

    public Job getJob() {
        return job;
    }

    public void setTradesman(User tradesman) {
        this.tradesman = tradesman;
    }

    public User getTradesman() {
        return tradesman;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() {
        return status;
    }
}
