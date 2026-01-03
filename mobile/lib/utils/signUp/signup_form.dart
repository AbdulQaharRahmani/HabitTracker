import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/features/routes.dart';
import 'package:habit_tracker/utils/signUp/form_label.dart';
import '../../app/app_theme.dart';
import 'custom_text_field.dart';
import 'signup_controller.dart';

class SignupForm extends StatefulWidget {
  const SignupForm({super.key});

  @override
  State<SignupForm> createState() => _SignupFormState();
}

class _SignupFormState extends State<SignupForm> {
  final controller = SignUpController();
  bool hidePassword = true;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 420.w),
        child: Form(
          key: controller.formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              /// Full name
              FormLabel(text: 'Full Name'),
              CustomTextField(
                controller: controller.usernameController,
                hintText: 'Ahmad Amiri',
                icon: Icons.person_outline,
                keyboardType: TextInputType.name,
                obsecureText: false,
              ),


              SizedBox(height: 10.h),

              /// Email
              FormLabel(text: 'Email Address'),
              CustomTextField(
                controller: controller.emailController,
                hintText: 'you@example.com',
                icon: Icons.email_outlined,
                obsecureText: false,
                keyboardType: TextInputType.emailAddress,
              ),

              SizedBox(height: 10.h),

              /// Password
              FormLabel(text: 'Password'),
              CustomTextField(
                controller: controller.passwordController,
                hintText: '••••••••',
                obsecureText: hidePassword,
                icon: Icons.lock_outline,
                keyboardType: TextInputType.visiblePassword,
                suffixIcon: IconButton(
                  icon: Icon(
                    hidePassword ? Icons.visibility_off : Icons.visibility,
                    size: 18.sp,
                  ),
                  onPressed: () {
                    setState(() => hidePassword = !hidePassword);
                  },
                ),
              ),


              SizedBox(height: 20.h),

              /// Sign up button
              SizedBox(
                width: double.infinity,
                height: 48.h,
                child: ElevatedButton(
                  onPressed: () async {
                    final ok = await controller.signUp();
                    if (!mounted) return;
                    if (ok) {
                     Navigator.pushNamed(context,AppRoutes.home);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14.r),
                    ),
                  ),
                  child: Text(
                    'Create Account',
                    style: TextStyle(color: AppTheme.textWhite),
                  ),
                ),
              ),

              SizedBox(height: 22.h),

              /// Divider
              Row(
                children: [
                  Expanded(child: Divider(thickness: .6)),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 10.w),
                    child: Text(
                      'Or continue with',
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ),
                  Expanded(child: Divider(thickness: .6)),
                ],
              ),
              SizedBox(height: 18.h),
            ],
          ),
        ),
      ),
    );
  }
}

