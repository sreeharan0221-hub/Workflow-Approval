package com.approvalflow.service;

import com.approvalflow.model.User;
import com.approvalflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // Master admin credentials
    private static final String MASTER_ADMIN_USER = "svhec";
    private static final String MASTER_ADMIN_PASS = "svhec@123";

    // Role-based admin passwords (matching existing frontend logic)
    private static final Map<String, String> ROLE_PASSWORDS = new HashMap<>();
    static {
        ROLE_PASSWORDS.put("Accountant", "Accountant@123");
        ROLE_PASSWORDS.put("Manager", "Manager@123");
        ROLE_PASSWORDS.put("CFO", "CFO@123");
        ROLE_PASSWORDS.put("Managing Director", "Managing Director@123");
    }

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Login with username + password.
     * Checks master admin first, then role-based admin passwords, then registered users.
     */
    public Map<String, Object> login(String username, String password) {
        Map<String, Object> result = new HashMap<>();

        // 1. Check master admin
        if (MASTER_ADMIN_USER.equals(username) && MASTER_ADMIN_PASS.equals(password)) {
            result.put("success", true);
            result.put("username", MASTER_ADMIN_USER);
            result.put("role", "Super Admin");
            return result;
        }

        // 2. Check role-based admin passwords (AdminPanel login)
        if (ROLE_PASSWORDS.containsKey(username)) {
            if (ROLE_PASSWORDS.get(username).equals(password)) {
                result.put("success", true);
                result.put("username", username);
                result.put("role", username);
                return result;
            }
        }

        // 3. Check registered users in database
        Optional<User> userOpt = userRepository.findByUsernameAndPassword(username, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if ("Pending".equals(user.getStatus())) {
                result.put("success", false);
                result.put("error", "Account waiting for Admin Approval!");
                return result;
            } else if ("Rejected".equals(user.getStatus())) {
                result.put("success", false);
                result.put("error", "Your registration was rejected by Admin.");
                return result;
            }
            // Approved user
            result.put("success", true);
            result.put("username", user.getUsername());
            result.put("role", user.getRole());
            return result;
        }

        result.put("success", false);
        result.put("error", "Invalid username or password!");
        return result;
    }

    /**
     * Register a new user (status = Pending until admin approves).
     */
    public Map<String, Object> register(String username, String password, String role) {
        Map<String, Object> result = new HashMap<>();

        if (userRepository.existsByUsername(username)) {
            result.put("success", false);
            result.put("error", "Username already exists!");
            return result;
        }

        User newUser = new User(
            username,
            password,
            role,
            "Pending",
            LocalDate.now().toString()
        );
        userRepository.save(newUser);

        result.put("success", true);
        result.put("message", "Registration sent to Admin for approval!");
        return result;
    }

    /**
     * Get all users with Pending status (for admin user management).
     */
    public List<User> getPendingUsers() {
        return userRepository.findByStatus("Pending");
    }

    /**
     * Approve a user registration.
     */
    public boolean approveUser(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus("Approved");
            userRepository.save(user);
            return true;
        }
        return false;
    }

    /**
     * Reject a user registration.
     */
    public boolean rejectUser(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus("Rejected");
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
