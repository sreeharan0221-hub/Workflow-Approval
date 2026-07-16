package com.approvalflow.repository;

import com.approvalflow.model.ApprovalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {

    Optional<ApprovalRequest> findByRequestId(String requestId);

    List<ApprovalRequest> findByStatus(String status);

    List<ApprovalRequest> findByPendingWithAndStatus(String pendingWith, String status);

    List<ApprovalRequest> findByStatusAndPendingWith(String status, String pendingWith);

    long countByStatus(String status);

    List<ApprovalRequest> findAllByOrderByIdDesc();
}
