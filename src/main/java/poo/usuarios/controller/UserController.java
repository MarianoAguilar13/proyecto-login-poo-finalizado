package poo.usuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import poo.usuarios.entity.GoogleUser;
import poo.usuarios.entity.SignInUser;
import poo.usuarios.entity.User;
import poo.usuarios.services.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    //Create user
    @PostMapping
    public ResponseEntity<?> create (@RequestBody User user){
        //devolvemo el codigo http de crado y
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user));

    }

    //leer un usuario
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable(value = "id") Long userId){
        //nos devuelve un optional el metodo findById del service
        //esto se hace porque el id puede que no exista en la bd y hay que salvar este problema
        Optional<User> oUser = userService.findById(userId);

        if (!oUser.isPresent()){
            //el 404 porque no se encontro
            return ResponseEntity.notFound().build();
        }

        return  ResponseEntity.ok(oUser);

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update (@RequestBody User newUser, @PathVariable(value = "id") Long userId){

       try {
           Optional<User> user = userService.findById(userId);

           if (!user.isPresent()){
               return null;
           }

           user.get().setNombre(newUser.getNombre());
           user.get().setApellido(newUser.getApellido());
           user.get().setEmail(newUser.getEmail());
           user.get().setPassword(newUser.getPassword());
           user.get().setAdmin(newUser.getAdmin());

           return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user.get()));
       }catch (Exception e){
           System.out.println(e);
           return null;
       }
    }

    @GetMapping
    public List<User> readAll(){
        List<User> users = StreamSupport.stream(userService.findAll().spliterator(),false).collect(Collectors.toList());

        return users;

    }

    @GetMapping("/email/{email}")
    public List<User> getUserByEmail(@PathVariable(value = "email") String emailSearch){
        //nos devuelve un optional el metodo findById del service
        //esto se hace porque el id puede que no exista en la bd y hay que salvar este problema

        try {
            return userService.findByEmail(emailSearch);
        }catch (Exception e){
            System.out.println(e);
            return null;
        }
    }


    @PostMapping("/sign-in")
    public User iniciarSesion (@RequestBody SignInUser signInUser){

        try {
            //encuentro en la db el usuario con el mail que pase y luego comparo su contraseña con la enviada
          List users = userService.findByEmail(signInUser.getEmail());
          User user = (User) users.get(0);
          System.out.println("la contraseña de la db es: " + user.getPassword());
            System.out.println("la contraseña del endpoint es: " + signInUser.getPassword());
          if (user.getPassword().equals(signInUser.getPassword())){
              return user;
          }else {
              return null;
          }
        }catch (Exception e){
            System.out.println(e);
            return null;
        }

    }

    @DeleteMapping("/{id}")
    public boolean delete (@PathVariable(value = "id") Long userId){

        try {
            userService.deleteById(userId);
            return true;
        }catch (Exception e){
            System.out.println(e);
            return false;
        }

    }


    @GetMapping("/data-google")
    public GoogleUser obtenerEmailUsuario(OAuth2AuthenticationToken OAuth2AuthenticationToken){

        GoogleUser googleUser = new GoogleUser("","");

        try {
            googleUser.setNombre(OAuth2AuthenticationToken.getPrincipal().getAttributes().get("name").toString());
            googleUser.setEmail(OAuth2AuthenticationToken.getPrincipal().getAttributes().get("email").toString());
            return  googleUser;
        }catch (Exception e){
            return null;
        }
    }

}
