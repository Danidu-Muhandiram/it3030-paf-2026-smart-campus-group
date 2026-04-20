package com.smartcampus.modules.tickets.repository;

import com.smartcampus.modules.tickets.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
}
