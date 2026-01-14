import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/features/routes.dart';
import '../../app/app_theme.dart';
import '../login_utils/controller.dart';

class LoginCard extends StatefulWidget {
  final LoginController controller;
  const LoginCard({super.key, required this.controller});

  @override
  State<LoginCard> createState() => _LoginCardState();
}

class _LoginCardState extends State<LoginCard> {
  LoginController get controller => widget.controller;
  bool _isPasswordHidden = true;

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
              /// Email label
              Text(
                'Email Address',
                style: TextStyle(
                  fontSize: 12.sp,
                  color: AppTheme.textSecondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: 6.h),

              /// Email field
              TextFormField(
                controller: controller.emailController,
                validator: controller.emailValidator,
                cursorColor: AppTheme.primary,
                style: TextStyle(fontSize: 14.sp),
                decoration: InputDecoration(
                  hintText: 'you@example.com',
                  prefixIcon: Icon(Icons.email_outlined, size: 18.sp),
                  filled: true,
                  fillColor: AppTheme.inputBackground,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14.r),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              SizedBox(height: 10.h),

              /// Password label
              Row(
                children: [
                  Text(
                    'Password',
                    style: TextStyle(
                      fontSize: 12.sp,
                      color: AppTheme.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () {},
                    child: Text(
                      'Forgot password?',
                      style: TextStyle(fontSize: 12.sp),
                    ),
                  ),
                ],
              ),

              /// Password field
              TextFormField(
                controller: controller.passwordController,
                validator: controller.passwordValidator,
                obscureText: _isPasswordHidden,
                style: TextStyle(fontSize: 14.sp),
                decoration: InputDecoration(
                  hintText: '••••••••',
                  prefixIcon: Icon(Icons.lock_outline, size: 18.sp),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isPasswordHidden
                          ? Icons.visibility_off
                          : Icons.visibility,
                      size: 18.sp,
                    ),
                    onPressed: () {
                      setState(() {
                        _isPasswordHidden = !_isPasswordHidden;
                      });
                    },
                  ),
                  filled: true,
                  fillColor: AppTheme.inputBackground,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14.r),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              SizedBox(height: 20.h),

              /// Login button
              SizedBox(
                width: double.infinity,
                height: 48.h,
                child: ElevatedButton(
                  onPressed: controller.isLoading
                      ? null
                      : () async {
                          final success = await controller.login();

                          if (!context.mounted) return;

                          if (success) {
                            Navigator.pushReplacementNamed(
                              context,
                              AppRoutes.home,
                            );
                          } else if (controller.errorMessage != null) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(controller.errorMessage!)),
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
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Text(
                          'Log In',
                          style: TextStyle(color: AppTheme.textWhite),
                        ),
                ),
              ),

              SizedBox(height: 22.h),

              /// Divider
              Row(
                children: [
                  Expanded(
                    child: Divider(thickness: 0.6, color: Colors.black26),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12.w),
                    child: Text(
                      'Or continue with',
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Divider(thickness: 0.6, color: Colors.black26),
                  ),
                ],
              ),

              SizedBox(height: 14.h),
              SizedBox(
                width: double.infinity,
                height: 48.h,
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: Image.asset(
                    'assets/icons/google-icon.png',
                    width: 18.w,
                  ),
                  label: Text(
                    'Sign in with Google',
                    style: TextStyle(
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14.r),
                    ),
                  ),
                ),
              ),
              SizedBox(height: 14.h),

              /// Signup row
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have an account?",
                    style: TextStyle(fontSize: 12.sp),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushNamed(context, AppRoutes.signup);
                    },
                    child: Text('Sign up', style: TextStyle(fontSize: 12.sp)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
