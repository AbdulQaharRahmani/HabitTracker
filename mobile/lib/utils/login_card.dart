import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../app/app_theme.dart';

class LoginCard extends StatelessWidget {
  const LoginCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppTheme.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Padding(
        padding: EdgeInsets.all(20.w),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxWidth: 420.w, // عالی برای tablet / web
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              /// Email
              TextField(
                style: TextStyle(fontSize: 14.sp),
                decoration: InputDecoration(
                  labelText: 'Email',
                  hintText: 'you@example.com',
                  prefixIcon: Icon(Icons.email_outlined, size: 20.sp),
                ),
              ),

              SizedBox(height: 14.h),

              /// Password
              TextField(
                obscureText: true,
                style: TextStyle(fontSize: 14.sp),
                decoration: InputDecoration(
                  labelText: 'Password',
                  hintText: 'Enter your password',
                  prefixIcon: Icon(Icons.lock_outline, size: 20.sp),
                  suffixIcon:
                  Icon(Icons.visibility_off, size: 18.sp),
                ),
              ),

              SizedBox(height: 12.h),

              /// Remember / Forgot
              Row(
                children: [
                  Checkbox(
                    value: false,
                    onChanged: (_) {},
                    visualDensity: VisualDensity.compact,
                  ),
                  Text(
                    'Remember me',
                    style: TextStyle(fontSize: 12.sp),
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

              SizedBox(height: 14.h),

              /// Login Button
              SizedBox(
                width: double.infinity,
                height: 46.h,
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: Icon(
                    Icons.login,
                    size: 18.sp,
                    color: Colors.black54,
                  ),
                  label: Text(
                    'Login',
                    style: TextStyle(
                      fontSize: 14.sp,
                      color: Colors.black54,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

              SizedBox(height: 14.h),

              /// Sign up
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have an account?",
                    style: TextStyle(fontSize: 12.sp),
                  ),
                  SizedBox(width: 4.w),
                  TextButton(
                    onPressed: () {},
                    child: Text(
                      'Create account',
                      style: TextStyle(fontSize: 12.sp),
                    ),
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
