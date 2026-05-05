package com.bookswap.bookswap.controller;

import com.bookswap.bookswap.model.Book;
import com.bookswap.bookswap.model.User;
import com.bookswap.bookswap.repository.BookRepository;
import com.bookswap.bookswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findByStatus("AVAILABLE");
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String query) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrGenreContainingIgnoreCase(query, query, query);
    }

    @PostMapping("/{userId}")
    public Book addBook(@PathVariable Long userId, @RequestBody Book book) {
        User owner = userRepository.findById(userId).orElseThrow();
        book.setOwner(owner);
        return bookRepository.save(book);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        Book book = bookRepository.findById(id).orElseThrow();
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setGenre(bookDetails.getGenre());
        book.setCondition(bookDetails.getCondition());
        return bookRepository.save(book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookRepository.deleteById(id);
    }
}
