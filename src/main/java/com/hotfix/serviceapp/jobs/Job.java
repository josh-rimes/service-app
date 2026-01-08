package com.hotfix.serviceapp.jobs;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hotfix.serviceapp.bookings.Booking;
import com.hotfix.serviceapp.quotes.Quote;
import com.hotfix.serviceapp.users.User;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String location;

    @Enumerated(EnumType.STRING)
    private Urgency urgency;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    private User selectedTradesman;

    @OneToOne(mappedBy = "job", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Booking booking;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Quote> quotes = new ArrayList<>();

    public Job() {}

    public Job( String title, String description, String location, Urgency urgency, User customer, JobStatus status) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.urgency = urgency;
        this.customer = customer;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Urgency getUrgency() {
        return urgency;
    }

    public void setUrgency(Urgency urgency) {
        this.urgency = urgency;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public List<Quote> getQuotes() {
        return quotes;
    }

    public void setQuotes(List<Quote> quotes) {
        this.quotes = quotes;
    }

    public User getSelectedTradesman() {
        return selectedTradesman;
    }

    public void setSelectedTradesman(User selectedTradesman) {
        this.selectedTradesman = selectedTradesman;
    }

    public Booking getBooking() {
        return booking;
    }
}
