import 'package:flutter/material.dart';

import '../utils/header_card_login.dart';
import '../utils/login_card.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title:  Text('Login')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              HeaderCard(),
              const SizedBox(height: 20),
              LoginCard(),
            ],
          ),
        ),
      ),
    );
  }
}
