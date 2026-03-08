import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter/services.dart';
import 'package:habit_tracker/services/auth_service.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

import '../../app/app_theme.dart';
import '../../features/routes.dart';
import '../../providers/theme_provider.dart';
import '../../services/app_state.dart';
import '../../services/token_storage.dart';
import '../../utils/profile/profile_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final AuthService _api = AuthService();
  final AppState _appState = AppState();
  final ImagePicker _picker = ImagePicker();
  final List<int> _streakMilestones = <int>[7, 14, 25, 50, 70, 100, 150, 200, 365];

  HabitsData? habitsData;
  UserData? userData;
  String displayName = 'Habit Tracker User';
  String emailAddress = '';
  String profileImageUrl = '';
  bool loading = true;
  bool imageBusy = false;

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData({bool forceRefresh = false}) async {
    if (!forceRefresh && _appState.isProfileLoaded) {
      final localUser = await AuthManager.getUserData();
      if (!mounted) return;
      setState(() {
        habitsData = _appState.habitsData;
        userData = _appState.userData;
        displayName = _resolveDisplayName(localUser?['name'], localUser?['email'], _appState.userData);
        emailAddress = localUser?['email'] ?? '';
        loading = false;
      });
      await _syncProfileImage();
      return;
    }

    try {
      final localUser = await AuthManager.getUserData();
      final welcome = await _api.fetchHabitsDashboard();
      final profileRes = await _api.getUserProfile();
      final fetchedUser = profileRes['data'] != null ? UserData.fromJson(profileRes['data']) : null;

      if (!mounted) return;
      setState(() {
        habitsData = welcome.habitsData;
        userData = fetchedUser;
        displayName = _resolveDisplayName(localUser?['name'], localUser?['email'], fetchedUser);
        emailAddress = localUser?['email'] ?? '';
        loading = false;
      });
      await _syncProfileImage();
    } catch (_) {
      final localUser = await AuthManager.getUserData();
      if (!mounted) return;
      setState(() {
        displayName = _resolveDisplayName(localUser?['name'], localUser?['email'], userData);
        emailAddress = localUser?['email'] ?? '';
        loading = false;
      });
    }
  }

  String _resolveDisplayName(String? name, String? email, UserData? profile) {
    if (name != null && name.trim().isNotEmpty) return name.trim();
    if (email != null && email.contains('@')) return email.split('@').first.capitalize();
    if (profile?.userId.trim().isNotEmpty == true) return profile!.userId;
    return 'Habit Tracker User';
  }

  Future<void> _syncProfileImage() async {
    final res = await _api.getProfileImage(userId: userData?.userId);
    if (!mounted) return;
    final bool ok = res['success'] == true && res['data'] is String;
    setState(() {
      profileImageUrl = ok ? (res['data'] as String) : '';
    });
  }

  Future<void> _refreshProfile() async {
    await _loadProfileData(forceRefresh: true);
  }

  Future<void> _showAvatarActions() async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18.r)),
      ),
      builder: (_) {
        return SafeArea(
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: 8.h),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  leading: Icon(Icons.camera_alt_outlined, color: AppTheme.primary),
                  title: const Text('Take photo'),
                  onTap: () {
                    Navigator.pop(context);
                    _pickAndUpload(ImageSource.camera);
                  },
                ),
                ListTile(
                  leading: Icon(Icons.photo_library_outlined, color: AppTheme.primary),
                  title: const Text('Choose from gallery'),
                  onTap: () {
                    Navigator.pop(context);
                    _pickAndUpload(ImageSource.gallery);
                  },
                ),
                if (profileImageUrl.isNotEmpty)
                  ListTile(
                    leading: Icon(Icons.visibility_outlined, color: AppTheme.textPrimary),
                    title: const Text('View photo'),
                    onTap: () {
                      Navigator.pop(context);
                      _showImagePreview();
                    },
                  ),
                if (profileImageUrl.isNotEmpty)
                  ListTile(
                    leading: Icon(Icons.delete_outline, color: AppTheme.error),
                    title: Text('Remove photo', style: TextStyle(color: AppTheme.error)),
                    onTap: () {
                      Navigator.pop(context);
                      _removeProfileImage();
                    },
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _pickAndUpload(ImageSource source) async {
    try {
      final picked = await _picker.pickImage(source: source, imageQuality: 85, maxWidth: 1200);
      if (picked == null) return;
      final imageFile = File(picked.path);
      final bytes = await imageFile.length();
      const maxAllowedBytes = 2 * 1024 * 1024;
      if (bytes > maxAllowedBytes) {
        if (!mounted) return;
        _showMessage('Image is too large (max 2MB). Please choose a smaller image.', isError: true);
        return;
      }

      if (!mounted) return;
      setState(() => imageBusy = true);

      final res = await _api.uploadProfileImage(imageFile);
      final ok = res['success'] == true;
      if (!mounted) return;

      if (ok) {
        await _syncProfileImage();
        _showMessage('Profile image updated');
      } else {
        final msg = (res['message'] ?? 'Could not upload image').toString();
        _showMessage(msg, isError: true);
      }
    } on PlatformException catch (e) {
      if (!mounted) return;
      final code = e.code.toLowerCase();
      if (code.contains('denied')) {
        _showMessage('Permission denied for camera/photos. Please allow it in app settings.', isError: true);
      } else if (code.contains('plugin')) {
        _showMessage('Image picker is not initialized. Please fully restart the app.', isError: true);
      } else {
        _showMessage('Image picker error: ${e.message ?? e.code}', isError: true);
      }
    } catch (e) {
      if (!mounted) return;
      _showMessage('Could not pick/upload image: $e', isError: true);
    } finally {
      if (mounted) setState(() => imageBusy = false);
    }
  }

  Future<void> _removeProfileImage() async {
    final shouldRemove = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Remove profile image?'),
            content: const Text('This will remove your current profile photo.'),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                child: Text('Remove', style: TextStyle(color: AppTheme.error)),
              ),
            ],
          ),
        ) ??
        false;

    if (!shouldRemove) return;

    setState(() => imageBusy = true);
    final res = await _api.removeProfileImage();
    if (!mounted) return;

    if (res['success'] == true) {
      setState(() => profileImageUrl = '');
      _showMessage('Profile image removed');
    } else {
      _showMessage((res['message'] ?? 'Could not remove image').toString(), isError: true);
    }

    setState(() => imageBusy = false);
  }

  void _showImagePreview() {
    if (profileImageUrl.isEmpty) return;
    showDialog<void>(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(18.r),
          child: InteractiveViewer(
            child: Image.network(
              profileImageUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, error, stackTrace) => Container(
                color: AppTheme.surface,
                padding: EdgeInsets.all(20.w),
                child: Text('Unable to load image', style: TextStyle(color: AppTheme.textPrimary)),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showMessage(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppTheme.error : AppTheme.success,
      ),
    );
  }

  int get _streak => habitsData?.currentStreak ?? 0;
  int get _totalHabits => habitsData?.totalHabits ?? 0;
  int get _completionRate => habitsData?.completionRate ?? 0;

  int? get _nextMilestone {
    for (final milestone in _streakMilestones) {
      if (_streak < milestone) return milestone;
    }
    return null;
  }

  int get _unlockedMilestonesCount {
    return _streakMilestones.where((m) => _streak >= m).length;
  }

  Widget _buildShimmer() {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
        child: Column(
          children: [
            SizedBox(height: 28.h),
            Shimmer.fromColors(
              baseColor: AppTheme.border.withOpacity(0.5),
              highlightColor: AppTheme.surface,
              child: Container(
                height: 210.h,
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(22.r),
                ),
              ),
            ),
            SizedBox(height: 16.h),
            Shimmer.fromColors(
              baseColor: AppTheme.border.withOpacity(0.5),
              highlightColor: AppTheme.surface,
              child: Container(
                height: 130.h,
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(16.r),
                ),
              ),
            ),
            SizedBox(height: 16.h),
            Shimmer.fromColors(
              baseColor: AppTheme.border.withOpacity(0.5),
              highlightColor: AppTheme.surface,
              child: Container(
                height: 220.h,
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(16.r),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);
    if (loading) return _buildShimmer();

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Stack(
        children: [
          RefreshIndicator(
            onRefresh: _refreshProfile,
            color: AppTheme.primary,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 18.h),
                  _buildProfileHeader(),
                  SizedBox(height: 16.h),
                  _buildStatsGrid(),
                  SizedBox(height: 16.h),
                  _buildAchievementSection(),
                  SizedBox(height: 16.h),
                  if (userData != null) _buildPreferencesCard(),
                  if (userData != null) SizedBox(height: 16.h),
                  _buildLogoutButton(),
                  SizedBox(height: 24.h),
                ],
              ),
            ),
          ),
          if (imageBusy)
            Container(
              color: Colors.black.withOpacity(0.2),
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader() {
    final String streakText = '$_streak day streak';
    final String secondaryText = emailAddress.isNotEmpty
        ? emailAddress
        : (_nextMilestone == null ? 'All milestone tiers unlocked' : 'Next achievement at $_nextMilestone days');

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22.r),
        gradient: LinearGradient(
          colors: [
            AppTheme.primary,
            AppTheme.primary.withOpacity(0.78),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withOpacity(0.28),
            blurRadius: 18.r,
            offset: Offset(0, 10.h),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: _showAvatarActions,
                child: Stack(
                  children: [
                    Container(
                      padding: EdgeInsets.all(2.w),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.18),
                        shape: BoxShape.circle,
                      ),
                      child: CircleAvatar(
                        radius: 36.r,
                        backgroundColor: Colors.white.withOpacity(0.2),
                        child: ClipOval(child: _buildAvatarContent()),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        width: 24.w,
                        height: 24.w,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppTheme.primary, width: 2),
                        ),
                        child: Icon(Icons.edit, size: 12.r, color: AppTheme.primary),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(width: 14.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      displayName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 22.sp,
                      ),
                    ),
                    SizedBox(height: 5.h),
                    Text(
                      secondaryText,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 13.sp,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 14.h),
          Row(
            children: [
              _buildHeaderPill(Icons.local_fire_department, streakText),
              SizedBox(width: 8.w),
              _buildHeaderPill(Icons.emoji_events, '$_unlockedMilestonesCount badges'),
            ],
          ),
          SizedBox(height: 10.h),
          Row(
            children: [
              TextButton.icon(
                onPressed: _showAvatarActions,
                style: TextButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.white.withOpacity(0.15),
                  padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
                ),
                icon: Icon(Icons.photo_camera_back_outlined, size: 16.r),
                label: Text('Change photo', style: TextStyle(fontSize: 12.sp)),
              ),
              if (profileImageUrl.isNotEmpty) SizedBox(width: 8.w),
              if (profileImageUrl.isNotEmpty)
                TextButton.icon(
                  onPressed: _removeProfileImage,
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.red.withOpacity(0.2),
                    padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
                  ),
                  icon: Icon(Icons.delete_outline, size: 16.r),
                  label: Text('Remove', style: TextStyle(fontSize: 12.sp)),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAvatarContent() {
    if (profileImageUrl.isNotEmpty) {
      return Image.network(
        profileImageUrl,
        width: 72.r,
        height: 72.r,
        fit: BoxFit.cover,
        errorBuilder: (_, error, stackTrace) => _buildAvatarFallback(),
      );
    }
    return _buildAvatarFallback();
  }

  Widget _buildAvatarFallback() {
    return Container(
      width: 72.r,
      height: 72.r,
      alignment: Alignment.center,
      color: Colors.transparent,
      child: Text(
        displayName.isNotEmpty ? displayName[0].toUpperCase() : 'U',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 28.sp,
        ),
      ),
    );
  }

  Widget _buildHeaderPill(IconData icon, String text) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.16),
        borderRadius: BorderRadius.circular(999.r),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 16.r),
          SizedBox(width: 6.w),
          Text(
            text,
            style: TextStyle(
              color: Colors.white,
              fontSize: 12.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 10.r,
            offset: Offset(0, 5.h),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(child: _buildMiniStat('Habits', '$_totalHabits', Icons.track_changes, AppTheme.primary)),
          Expanded(child: _buildMiniStat('Completion', '$_completionRate%', Icons.check_circle_outline, AppTheme.success)),
          Expanded(child: _buildMiniStat('Streak', '$_streak', Icons.local_fire_department, Colors.orange)),
        ],
      ),
    );
  }

  Widget _buildMiniStat(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Container(
          width: 38.w,
          height: 38.w,
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 18.r, color: color),
        ),
        SizedBox(height: 8.h),
        Text(
          value,
          style: TextStyle(
            color: AppTheme.textPrimary,
            fontSize: 14.sp,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 2.h),
        Text(
          label,
          style: TextStyle(color: AppTheme.textMuted, fontSize: 11.sp),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildAchievementSection() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 10.r,
            offset: Offset(0, 5.h),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.emoji_events, color: AppTheme.warning, size: 20.r),
              SizedBox(width: 8.w),
              Text(
                'Streak Achievements',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16.sp,
                  color: AppTheme.textPrimary,
                ),
              ),
            ],
          ),
          SizedBox(height: 6.h),
          Text(
            'Unlock at 25, 70, 100 and higher streaks.',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 12.sp),
          ),
          SizedBox(height: 14.h),
          GridView.builder(
            itemCount: _streakMilestones.length,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 8.w,
              mainAxisSpacing: 8.h,
              childAspectRatio: 1.06,
            ),
            itemBuilder: (context, index) {
              final int milestone = _streakMilestones[index];
              final bool unlocked = _streak >= milestone;
              return _buildAchievementCard(milestone, unlocked);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAchievementCard(int milestone, bool unlocked) {
    return Container(
      padding: EdgeInsets.all(10.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12.r),
        color: unlocked ? AppTheme.warningBackground : AppTheme.inputBackground,
        border: Border.all(
          color: unlocked ? AppTheme.warning.withOpacity(0.4) : AppTheme.border,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            unlocked ? Icons.workspace_premium : Icons.lock_outline,
            color: unlocked ? AppTheme.warning : AppTheme.textMuted,
            size: 18.r,
          ),
          SizedBox(height: 6.h),
          Text(
            '$milestone Days',
            style: TextStyle(
              color: unlocked ? AppTheme.warning : AppTheme.textSecondary,
              fontSize: 12.sp,
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: 2.h),
          Text(
            unlocked ? 'Unlocked' : 'Locked',
            style: TextStyle(
              color: unlocked ? AppTheme.warning : AppTheme.textMuted,
              fontSize: 10.sp,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreferencesCard() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 10.r,
            offset: Offset(0, 5.h),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Preferences',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16.sp,
              color: AppTheme.textPrimary,
            ),
          ),
          SizedBox(height: 12.h),
          _buildPreferenceRow(
            icon: Icons.calendar_today_outlined,
            label: 'Week Starts',
            value: (userData?.weekStartDay ?? 'monday').capitalize(),
          ),
          _buildPreferenceRow(
            icon: Icons.schedule_outlined,
            label: 'Daily Reminder',
            value: (userData?.dailyReminderEnabled ?? false)
                ? (userData?.dailyReminderTime ?? 'Not set')
                : 'Disabled',
          ),
          _buildPreferenceRow(
            icon: Icons.public,
            label: 'Timezone',
            value: userData?.timezone ?? 'UTC',
          ),
        ],
      ),
    );
  }

  Widget _buildPreferenceRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.h),
      child: Row(
        children: [
          Container(
            width: 34.w,
            height: 34.w,
            decoration: BoxDecoration(
              color: AppTheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10.r),
            ),
            child: Icon(icon, size: 16.r, color: AppTheme.primary),
          ),
          SizedBox(width: 10.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(color: AppTheme.textMuted, fontSize: 12.sp)),
                SizedBox(height: 2.h),
                Text(
                  value,
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () async {
          await AuthManager.logout();
          if (!mounted) return;
          Navigator.of(context, rootNavigator: true).pushNamedAndRemoveUntil(
            AppRoutes.login,
            (route) => false,
          );
        },
        icon: Icon(Icons.logout, size: 18.r),
        label: Text('Logout', style: TextStyle(fontSize: 15.sp, fontWeight: FontWeight.w600)),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppTheme.error,
          side: BorderSide(color: AppTheme.error.withOpacity(0.28)),
          padding: EdgeInsets.symmetric(vertical: 14.h),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.r)),
        ),
      ),
    );
  }
}

extension StringExtension on String {
  String capitalize() => isEmpty ? this : this[0].toUpperCase() + substring(1);
}
