import 'package:flutter/material.dart';
import 'package:habit_tracker/utils/form_label.dart';
import 'package:habit_tracker/utils/sign_up_button.dart';
import 'package:habit_tracker/utils/signup_controller.dart';
import 'package:habit_tracker/utils/square_tiles.dart';

import '../screans/home_screan.dart';
import 'custom_text_field.dart';

class SignupForm extends StatefulWidget {
  const SignupForm({super.key});

  @override
  State<SignupForm> createState() => _SignupFormState();
}

class _SignupFormState extends State<SignupForm> {
  final controller = SignUpController();
  bool isPasswordHidden = true;

  @override
  Widget build(BuildContext context) {
    return Form(
      key: controller.formKey,
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 15),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),

        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              // ======== TextFields ========
              FormLabel(text: 'Full Name'),
              CustomTextField(
                validator: controller.nameValidator,
                keyboardType: TextInputType.name,
                suffixIcon: null,
                icon: Icon(Icons.person),
                controller: controller.usernameController,
                hintText: 'Ahmad Amiri',
                obsecureText: false,
              ),

              //======== Email TextField ========
              const SizedBox(height: 8),
              FormLabel(text: 'Email'),
              CustomTextField(
                validator: controller.emailValidator,
                keyboardType: TextInputType.emailAddress,
                suffixIcon: null,
                icon: Icon(Icons.email),
                controller: controller.emailController,
                hintText: 'amiri@example.come',
                obsecureText: false,
              ),

              //======== Password  TextField ========
              const SizedBox(height: 8),
              FormLabel(text: 'Password'),
              CustomTextField(
                validator: controller.passwordValidator,
                keyboardType: TextInputType.visiblePassword,
                suffixIcon: IconButton(
                  onPressed: () {
                    setState(() {
                      isPasswordHidden = !isPasswordHidden;
                    });
                  },
                  icon: Icon(
                    isPasswordHidden ? Icons.visibility_off : Icons.visibility,
                  ),
                ),
                icon: Icon(Icons.password),
                // label: 'Password',
                controller: controller.passwordController,
                hintText: 'password',
                obsecureText: isPasswordHidden,
              ),

              const SizedBox(height: 15),

              //  ========  Check box  ========
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      height: 24,
                      width: 24,
                      child: Align(
                        alignment: Alignment.topCenter,
                        child: Checkbox(
                          fillColor: WidgetStateProperty.resolveWith<Color>((
                            Set<WidgetState> states,
                          ) {
                            if (states.contains(WidgetState.selected)) {
                              return Colors.blue;
                            }
                            return Colors.grey.shade300;
                          }),
                          value: controller.isAgreeTerms,
                          shape: const CircleBorder(),
                          materialTapTargetSize:
                              MaterialTapTargetSize.shrinkWrap,
                          visualDensity: VisualDensity.compact,
                          onChanged: (v) {
                            setState(() {
                              controller.isAgreeTerms = v ?? false;
                            });
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    //======== Agree to terms and privacy  ========
                    Expanded(
                      child: RichText(
                        text: TextSpan(
                          style: Theme.of(context).textTheme.bodyMedium,
                          children: [
                            const TextSpan(text: "I agree to the "),
                            TextSpan(
                              text: "Terms of Service",
                              style: const TextStyle(color: Colors.blue),
                            ),
                            const TextSpan(text: " and "),
                            TextSpan(
                              text: "Privacy Policy",
                              style: const TextStyle(color: Colors.blue),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              //======== Sign up button ========
              SignUpButtons(
                onTap: () {
                  final success = controller.signUp();
                  if (success) {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (_) => const HomeScreen()),
                          (route) => false,
                    );
                  } else {
                    if (!controller.isAgreeTerms) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Please accept terms and conditions'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  }
                },
              ),

              const SizedBox(height: 20),

              //======= divider ========
              _dividers(),

              const SizedBox(height: 20),

              // ======== Square tiles or google and apple sign up ========
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  SquareTiles(imagePath: 'assets/google.png'),
                  SizedBox(width: 25),
                  SquareTiles(imagePath: 'assets/apple-logo.png'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _dividers() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Row(
        children: [
          Expanded(child: Divider(color: Colors.grey[400])),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal:10),
            child: Text(
              'Or continue with',
              style: TextStyle(color: Colors.grey[700]),
            ),
          ),
          Expanded(child: Divider(color: Colors.grey[400])),
        ],
      ),
    );
  }
}
