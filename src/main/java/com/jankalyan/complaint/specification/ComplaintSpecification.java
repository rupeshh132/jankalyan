package com.jankalyan.complaint.specification;

import com.jankalyan.complaint.entity.Complaint;
import com.jankalyan.complaint.entity.ComplaintStatus;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ComplaintSpecification {

    public static Specification<Complaint> getPublicComplaints(String search, UUID categoryId, ComplaintStatus status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always enforce isDeleted = false for public complaints
            predicates.add(criteriaBuilder.isFalse(root.get("isDeleted")));

            // Search filter
            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                
                // Join category to search by category name
                Join<Object, Object> categoryJoin = root.join("category", JoinType.LEFT);

                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                Predicate addressMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), searchPattern);
                Predicate categoryNameMatch = criteriaBuilder.like(criteriaBuilder.lower(categoryJoin.get("name")), searchPattern);

                predicates.add(criteriaBuilder.or(titleMatch, descMatch, addressMatch, categoryNameMatch));
            }

            // Category ID filter
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            // Status filter
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            // Optimization for N+1 when retrieving Page content, not for count queries
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("category", JoinType.LEFT);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
