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
  void dispose() {
    controller.dispose();
    super.dispose();
  }

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
                validator: controller.nameValidator,
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
                validator: controller.emailValidator,
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
                validator: controller.passwordValidator,
              ),

              SizedBox(height: 14.h),

              /// agree terms
              Row(
                children: [
                  Checkbox(
                    value: controller.isAgreeTerms,
                    onChanged: (value) {
                      setState(() {
                        controller.isAgreeTerms = value!;
                      });
                    },
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {

                        print('Terms and conditions tapped');
                      },
                      child: RichText(
                        text: TextSpan(
                          style: TextStyle(
                            fontSize: 12.sp,
                            color: AppTheme.textSecondary,
                          ),
                          children: [
                            TextSpan(text: "I agree to the "),
                            TextSpan(
                              text: "Terms of Service",
                              style: TextStyle(
                                color: AppTheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            TextSpan(text: " and "),
                            TextSpan(
                              text: "Privacy Policy",
                              style: TextStyle(
                                color: AppTheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              SizedBox(height: 14.h),

              /// Sign up button
              ListenableBuilder(
                listenable: controller,
                builder: (context, _) {
                  return SizedBox(
                    width: double.infinity,
                    height: 48.h,
                    child: ElevatedButton(
                      onPressed: controller.isLoading
                          ? null
                          : () async {
                              final ok = await controller.signUp(context);
                              if (ok && mounted) {
                                Navigator.pushReplacementNamed(
                                  context,
                                  AppRoutes.home,
                                );
                              }
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14.r),
                        ),
                      ),
                      child: controller.isLoading
                          ? SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : Text(
                              'Create Account',
                              style: TextStyle(
                                color: AppTheme.textWhite,
                                fontSize: 16.sp,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  );
                },
              ),

              SizedBox(height: 22.h),

              /// Divider
              Row(
                children: [
                  Expanded(
                    child: Divider(thickness: 0.6, color: Colors.grey[300]),
                  ),
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
                  Expanded(
                    child: Divider(thickness: 0.6, color: Colors.grey[300]),
                  ),
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
