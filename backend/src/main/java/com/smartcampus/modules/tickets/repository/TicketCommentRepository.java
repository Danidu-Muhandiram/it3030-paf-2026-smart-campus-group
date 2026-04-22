package com.smartcampus.modules.tickets.repository;

import com.smartcampus.modules.tickets.entity.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

    List<TicketComment> findByTicket_IdOrderByCreatedAtAsc(Long ticketId);

    Optional<TicketComment> findByIdAndTicket_Id(Long commentId, Long ticketId);
}
