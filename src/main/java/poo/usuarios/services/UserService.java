package poo.usuarios.services;


import poo.usuarios.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    /*ya que la clase de jpa te devuelve iterables cuando encuentra algo*/

    public Iterable<User> findAll();

    public Optional<User> findById(Long id);

    public List<User> findByEmail(String email);

    public User save(User user);

    public void deleteById(Long id);

}
