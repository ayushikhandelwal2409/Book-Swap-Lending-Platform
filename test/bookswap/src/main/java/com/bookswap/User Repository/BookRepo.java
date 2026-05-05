package com.bookswap.User Repository;

public package com.bookswap.repository;

import com.bookswap.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepo extends JpaRepository<Book, Long> {

    List<Book> findByTitleContaining(String title);
    List<Book> findByAuthorContaining(String author);
} {
    
}
