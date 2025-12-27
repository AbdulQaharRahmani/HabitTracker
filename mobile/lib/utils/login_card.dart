import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../app/app_theme.dart';
class LoginCard extends StatelessWidget {

  final TextEditingController emailController;
  final TextEditingController passwordController;
  final VoidCallback onLoginSuccess;

  const LoginCard({
    super.key,
    required this.emailController,
    required this.passwordController,
    required this.onLoginSuccess,
  });
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 420.w),
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
            TextField(
              controller: emailController,
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

                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14.r),
                  borderSide: BorderSide.none,
                ),

                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14.r),
                  borderSide: BorderSide.none,
                ),
              ),
            ),

            SizedBox(height: 10.h),

            /// Password row
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
            TextField(
              controller: passwordController,
              obscureText: true,
              style: TextStyle(fontSize: 14.sp),
              decoration: InputDecoration(
                hintText: '••••••••',
                prefixIcon: Icon(Icons.lock_outline, size: 18.sp),
                suffixIcon: Icon(Icons.visibility_off, size: 18.sp),
                filled: true,
                fillColor: AppTheme.inputBackground,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14.r),
                  borderSide: BorderSide.none,
                ),

                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14.r),
                  borderSide: BorderSide.none,
                ),

                focusedBorder: OutlineInputBorder(
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
                onPressed: (){},
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,

                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14.r),
                  ),
                ),
                child:Text('Log In',style:TextStyle(color: AppTheme.textWhite) ,),
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
                    child: Divider(thickness: 0.6, color: Colors.black26),
                  ),
                ],
              ),

              SizedBox(height: 18.h),

              /// Google button
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

              /// Sign up
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have an account?",
                    style: TextStyle(fontSize: 12.sp),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: Text('Sign up', style: TextStyle(fontSize: 12.sp)),
                  ),
                ],
              ),
            ],
        ),
      ),
    );
  }
}
