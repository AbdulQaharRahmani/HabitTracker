import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../services/profile_service.dart';
import '../../features/profile_model.dart';
import '../../app/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _service = ProfileService();

  bool _loading = true;
  String? _error;

  UserData? _user;
  HabitsData? _habits;

  String _name = 'User';
  String _email = 'No email';

  @override
  void initState() {
    super.initState();
    _loadLocal();
    _fetchRemote();
  }
  Future<void> _loadLocal() async {
    final prefs = await SharedPreferences.getInstance();
    final storedName = prefs.getString('user_name');
    final storedEmail = prefs.getString('user_email');
    if (!mounted) return;
    setState(() {
      _name = (storedName != null && storedName.isNotEmpty)
          ? storedName
          : 'User';
      _email = (storedEmail != null && storedEmail.isNotEmpty)
          ? storedEmail
          : 'No email';
    });
  }
  Future<void> _fetchRemote() async {
    try {
      setState(() => _loading = true);

      final profile = await _service.getUserProfile();
      final dashboard = await _service.getHabitsDashboard();

      if (!profile['success'] || !dashboard['success']) {
        throw Exception();
      }

      setState(() {
        _user = Welcome.fromJson(profile).userData;
        _habits = Welcome.fromJson(dashboard).habitsData;
        _loading = false;
      });
    } catch (_) {
      setState(() {
        _error = 'Using local data';
        _loading = false;
      });
    }
  }

  Future<void> _handleLogout() async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Log Out', style: TextStyle(color: AppTheme.textPrimary)),
        content: Text('Are you sure you want to log out?',
            style: TextStyle(color: AppTheme.textSecondary)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: AppTheme.error),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );

    if (result == true) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
      if (mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/login', (_) => false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const _LoadingView();

    final habits = _habits;
    final achievements = _achievements(habits?.currentStreak ?? 0);

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: RefreshIndicator(
        onRefresh: _fetchRemote,
        color: AppTheme.primary,
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              expandedHeight: 80.h,
              backgroundColor: AppTheme.surface,
              elevation: 1,
              surfaceTintColor: AppTheme.surface,
              flexibleSpace: FlexibleSpaceBar(
                centerTitle: true,
                title: Text('Profile',
                    style: TextStyle(
                        fontSize: 18.sp,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textPrimary)),
                expandedTitleScale: 1.2,
              ),
            ),
            SliverList(
              delegate: SliverChildListDelegate([
                SizedBox(height: 16.h),
                ProfileHeader(
                    user: _user, name: _name, email: _email, error: _error),
                SizedBox(height: 24.h),
                StatsSection(habits: habits),
                SizedBox(height: 32.h),
                AchievementsSection(items: achievements),
                SizedBox(height: 32.h),
                _LogoutButton(onPressed: _handleLogout),
                SizedBox(height: 40.h),
              ]),
            ),
          ],
        ),
      ),
    );
  }

  List<Map<String, dynamic>> _achievements(int streak) => [
    _a('Beginner', 5, FontAwesomeIcons.seedling, AppTheme.success, streak),
    _a('Dedicated', 10, FontAwesomeIcons.fire, AppTheme.warning, streak),
    _a('Warrior', 30, FontAwesomeIcons.shield, AppTheme.primary, streak),
    _a('Legend', 100, FontAwesomeIcons.crown, Colors.amber, streak),
  ];

  Map<String, dynamic> _a(String t, int r, IconData i, Color c, int s) => {
    'title': t,
    'req': r,
    'icon': i,
    'color': c,
    'gradient': [c, c.withOpacity(0.8)],
    'unlocked': s >= r,
  };
}

/* ───────────────────────── Widgets ───────────────────────── */

class _LoadingView extends StatelessWidget {
  const _LoadingView();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(color: AppTheme.primary),
          SizedBox(height: 16.h),
          Text('Loading...',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 14.sp)),
        ],
      ),
    ),
  );
}

/* ───────── Profile Header ───────── */

class ProfileHeader extends StatelessWidget {
  final UserData? user;
  final String name;
  final String email;
  final String? error;

  const ProfileHeader({
    super.key,
    this.user,
    required this.name,
    required this.email,
    this.error,
  });

  @override
  Widget build(BuildContext context) => Container(
    margin: EdgeInsets.symmetric(horizontal: 20.w),
    padding: EdgeInsets.all(24.w),
    child: Column(
      children: [
        Stack(
          children: [
            Container(
              width: 96.w,
              height: 96.w,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.primary.withOpacity(0.1),
                border: Border.all(
                  color: AppTheme.primary.withOpacity(0.2),
                  width: 2.w,
                ),
              ),
              child: user?.profileImage == null
                  ? Icon(Icons.person_rounded,
                  size: 42.w, color: AppTheme.primary)
                  : ClipOval(
                  child: Image.network(user!.profileImage!,
                      fit: BoxFit.cover)),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                padding: EdgeInsets.all(6.w),
                decoration: BoxDecoration(
                  color: AppTheme.primary,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2.w),
                ),
                child: Icon(Icons.edit,
                    size: 12.w, color: Colors.white),
              ),
            ),
          ],
        ),
        SizedBox(height: 20.h),
        Text(name,
            style: TextStyle(
                fontSize: 22.sp,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary)),
        SizedBox(height: 4.h),
        Text(email,
            style: TextStyle(
                fontSize: 14.sp, color: AppTheme.textSecondary)),
        if (user?.timezone != null && user!.timezone.isNotEmpty) ...[
          SizedBox(height: 12.h),
          Container(
            padding:
            EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
            decoration: BoxDecoration(
              color: AppTheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20.r),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.public_rounded,
                    size: 12.w, color: AppTheme.primary),
                SizedBox(width: 6.w),
                Text(user!.timezone,
                    style: TextStyle(
                        fontSize: 12.sp,
                        color: AppTheme.primary,
                        fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ],
        if (error != null) ...[
          SizedBox(height: 16.h),
          Container(
            padding: EdgeInsets.all(12.w),
            decoration: BoxDecoration(
              color: AppTheme.warningBackground,
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(color: AppTheme.warning.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Icon(Icons.info_outline_rounded,
                    size: 16.w, color: AppTheme.warning),
                SizedBox(width: 8.w),
                Expanded(
                  child: Text(error!,
                      style: TextStyle(
                          fontSize: 13.sp,
                          color: AppTheme.textSecondary)),
                ),
              ],
            ),
          ),
        ],
      ],
    ),
  );
}

/* ───────── Stats ───────── */

class StatsSection extends StatelessWidget {
  final HabitsData? habits;
  const StatsSection({super.key, this.habits});

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Padding(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Text('Statistics',
            style: TextStyle(
                fontSize: 18.sp,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary)),
      ),
      SizedBox(height: 16.h),
      SizedBox(
        height: 130.h,
        child: ListView(
          padding: EdgeInsets.symmetric(horizontal: 12.w),
          scrollDirection: Axis.horizontal,
          children: [
            _StatCard(
                icon: FontAwesomeIcons.listCheck,
                value: '${habits?.totalHabits ?? 0}',
                label: 'Total Habits',
                color: AppTheme.primary),
            SizedBox(width: 8.w),
            _StatCard(
                icon: FontAwesomeIcons.fire,
                value: '${habits?.currentStreak ?? 0}',
                label: 'Current Streak',
                color: AppTheme.warning),
            SizedBox(width: 8.w),
            _StatCard(
                icon: FontAwesomeIcons.chartLine,
                value: '${habits?.completionRate ?? 0}%',
                label: 'Completion Rate',
                color: AppTheme.success),
          ],
        ),
      ),
    ],
  );
}
class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) => Container(
    width: 110.w,
    padding: EdgeInsets.all(16.w),
    decoration: BoxDecoration(
      color: color.withOpacity(0.1),
      borderRadius: BorderRadius.circular(16.r),
      border: Border.all(color: color.withOpacity(0.2)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32.w,
          height: 32.w,
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(8.r),
          ),
          child: Center(
            child: FaIcon(icon, size: 16.w, color: color),
          ),
        ),

        const Spacer(),

        /// 🔴 FIX اصلی overflow
        SizedBox(
          height: 28.h, // ارتفاع ثابت برای ثبات layout
          child: FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              value,
              style: TextStyle(
                fontSize: 22.sp,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
          ),
        ),

        SizedBox(height: 4.h),

        Text(
          label,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 12.sp,
            color: AppTheme.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    ),
  );
}

/* ───────── Achievements ───────── */

class AchievementsSection extends StatelessWidget {
  final List<Map<String, dynamic>> items;
  const AchievementsSection({super.key, required this.items});

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Padding(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Achievements',
                style: TextStyle(
                    fontSize: 18.sp,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary)),
            Container(
              padding:
              EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12.r),
              ),
              child: Text(
                '${items.where((a) => a['unlocked']).length}/${items.length}',
                style: TextStyle(
                    fontSize: 12.sp,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.primary),
              ),
            ),
          ],
        ),
      ),
      SizedBox(height: 16.h),
      Padding(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12.w,
            mainAxisSpacing: 12.h,
            childAspectRatio: 1.4,
          ),
          itemCount: items.length,
          itemBuilder: (_, i) => AchievementCard(items[i]),
        ),
      ),
    ],
  );
}

class AchievementCard extends StatelessWidget {
  final Map<String, dynamic> a;
  const AchievementCard(this.a, {super.key});

  @override
  Widget build(BuildContext context) => Container(
    padding: EdgeInsets.all(16.w),
    decoration: BoxDecoration(
      color: a['unlocked'] ? a['color'].withOpacity(0.1) : AppTheme.inputBackground,
      borderRadius: BorderRadius.circular(16.r),
      border: Border.all(
        color: a['unlocked'] ? a['color'].withOpacity(0.2) : AppTheme.border,
        width: 1.5,
      ),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: EdgeInsets.all(8.w),
              decoration: BoxDecoration(
                color: a['unlocked']
                    ? a['color'].withOpacity(0.15)
                    : AppTheme.border,
                borderRadius: BorderRadius.circular(10.r),
              ),
              child: FaIcon(a['icon'],
                  size: 16.w,
                  color: a['unlocked'] ? a['color'] : AppTheme.textMuted),
            ),
            if (a['unlocked'])
              Icon(Icons.check_circle_rounded,
                  size: 18.w, color: a['color']),
          ],
        ),
        Spacer(),
        Text(a['title'],
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w700,
                color: a['unlocked']
                    ? AppTheme.textPrimary
                    : AppTheme.textSecondary)),
        SizedBox(height: 4.h),
        Text(
          a['unlocked'] ? 'Achieved' : '${a['req']} days needed',
          style: TextStyle(
              fontSize: 11.sp,
              color: a['unlocked'] ? a['color'] : AppTheme.textMuted),
        ),
      ],
    ),
  );
}

/* ───────── Logout ───────── */

class _LogoutButton extends StatelessWidget {
  final VoidCallback onPressed;

  const _LogoutButton({required this.onPressed});

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.symmetric(horizontal: 20.w),
    child: SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: onPressed,
        icon: Icon(Icons.logout, size: 16.w),
        label: Text('Log Out',
            style: TextStyle(
                fontSize: 15.sp, fontWeight: FontWeight.w600)),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppTheme.error,
          side: BorderSide(color: AppTheme.error.withOpacity(0.2)),
          padding: EdgeInsets.symmetric(vertical: 16.h),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
          ),
        ),
      ),
    ),
  );
}