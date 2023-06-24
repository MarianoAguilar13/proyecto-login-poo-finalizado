package poo.usuarios.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import poo.usuarios.entity.User;
import poo.usuarios.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    /*Con la inyeccion de dependencia podemos usar el userepository donde estan todos los metodos del crud
     y lo de jpa, El Autowired instancia una vez el repository */

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Iterable<User> findAll() {

        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> findByEmail(String email) {
        return  userRepository.findByEmail(email);
    }


    @Override
    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
