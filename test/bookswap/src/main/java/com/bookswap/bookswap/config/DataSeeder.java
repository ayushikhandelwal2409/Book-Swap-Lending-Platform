package com.bookswap.bookswap.config;

import com.bookswap.bookswap.model.Book;
import com.bookswap.bookswap.model.User;
import com.bookswap.bookswap.repository.BookRepository;
import com.bookswap.bookswap.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository, BookRepository bookRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User u1 = new User();
                u1.setName("Alice");
                u1.setEmail("alice@example.com");
                u1.setPassword("password");
                userRepository.save(u1);

                User u2 = new User();
                u2.setName("Bob");
                u2.setEmail("bob@example.com");
                u2.setPassword("password");
                userRepository.save(u2);

                Book b1 = new Book();
                b1.setTitle("The Great Gatsby");
                b1.setAuthor("F. Scott Fitzgerald");
                b1.setGenre("Classic");
                b1.setCondition("Good");
                b1.setOwner(u1);
                bookRepository.save(b1);

                Book b2 = new Book();
                b2.setTitle("1984");
                b2.setAuthor("George Orwell");
                b2.setGenre("Dystopian");
                b2.setCondition("Like New");
                b2.setOwner(u2);
                bookRepository.save(b2);

                Book b3 = new Book();
                b3.setTitle("To Kill a Mockingbird");
                b3.setAuthor("Harper Lee");
                b3.setGenre("Classic");
                b3.setCondition("Fair");
                b3.setOwner(u1);
                bookRepository.save(b3);
            }
        };
    }
}
