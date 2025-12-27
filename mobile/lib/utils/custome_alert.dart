import 'package:flutter/material.dart';

class ModernAlertDialog {
  // =======Error Dailog======
  static Future<void> showError({
    required BuildContext context,
    required String title,
    required String message,
    String buttonText = 'OK',
    VoidCallback? onConfirm,
    bool barrierDismissible = true,
  }) async {
    await _showDialog(
      context: context,
      type: DialogType.error,
      title: title,
      message: message,
      primaryButtonText: buttonText,
      onPrimaryButtonTap: onConfirm,
      barrierDismissible: barrierDismissible,
    );
  }

  //========Success Dialog =====
  static Future<void> showSuccess({
    required BuildContext context,
    required String title,
    required String message,
    String buttonText = 'Continue',
    VoidCallback? onConfirm,
    bool barrierDismissible = false,
  }) async {
    await _showDialog(
      context: context,
      type: DialogType.success,
      title: title,
      message: message,
      primaryButtonText: buttonText,
      onPrimaryButtonTap: onConfirm,
      barrierDismissible: barrierDismissible,
    );
  }

  // ======Two button dialog
  static Future<void> showConfirm({
    required BuildContext context,
    required String title,
    required String message,
    String primaryButtonText = 'Confirm',
    String secondaryButtonText = 'Cancel',
    VoidCallback? onPrimaryTap,
    VoidCallback? onSecondaryTap,
    bool barrierDismissible = true,
  }) async {
    await _showDialog(
      context: context,
      type: DialogType.warning,
      title: title,
      message: message,
      primaryButtonText: primaryButtonText,
      secondaryButtonText: secondaryButtonText,
      onPrimaryButtonTap: onPrimaryTap,
      onSecondaryButtonTap: onSecondaryTap,
      barrierDismissible: barrierDismissible,
    );
  }

  // =======Information dialog==========
  static Future<void> showInfo({
    required BuildContext context,
    required String title,
    required String message,
    String buttonText = 'Got it',
    VoidCallback? onConfirm,
    bool barrierDismissible = true,
  }) async {
    await _showDialog(
      context: context,
      type: DialogType.info,
      title: title,
      message: message,
      primaryButtonText: buttonText,
      onPrimaryButtonTap: onConfirm,
      barrierDismissible: barrierDismissible,
    );
  }

  //========original method for calling dailog =====
  static Future<void> _showDialog({
    required BuildContext context,
    required DialogType type,
    required String title,
    required String message,
    String primaryButtonText = 'OK',
    String? secondaryButtonText,
    VoidCallback? onPrimaryButtonTap,
    VoidCallback? onSecondaryButtonTap,
    bool barrierDismissible = true,
  }) async {
    await showDialog(
      context: context,
      barrierDismissible: barrierDismissible,
      barrierColor: Colors.black.withValues(alpha: 0.5),
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          elevation: 0,
          backgroundColor: Colors.transparent,
          child: _DialogContent(
            type: type,
            title: title,
            message: message,
            primaryButtonText: primaryButtonText,
            secondaryButtonText: secondaryButtonText,
            onPrimaryButtonTap: onPrimaryButtonTap,
            onSecondaryButtonTap: onSecondaryButtonTap,
          ),
        );
      },
    );
  }
}

// =======Dailog types=======
enum DialogType { success, error, warning, info }

// =====Dialog contents========
class _DialogContent extends StatelessWidget {
  final DialogType type;
  final String title;
  final String message;
  final String primaryButtonText;
  final String? secondaryButtonText;
  final VoidCallback? onPrimaryButtonTap;
  final VoidCallback? onSecondaryButtonTap;

  const _DialogContent({
    required this.type,
    required this.title,
    required this.message,
    required this.primaryButtonText,
    this.secondaryButtonText,
    this.onPrimaryButtonTap,
    this.onSecondaryButtonTap,
  });

  // ======= Dialog Colors ===========
  Color get _primaryColor {
    switch (type) {
      case DialogType.success:
        return const Color(0xFF10B981);
      case DialogType.error:
        return const Color(0xFFEF4444);
      case DialogType.warning:
        return const Color(0xFFF59E0B);
      case DialogType.info:
        return const Color(0xFF3B82F6);
    }
  }

  // ======= Icons types =======
  IconData get _icon {
    switch (type) {
      case DialogType.success:
        return Icons.check_circle;
      case DialogType.error:
        return Icons.error;
      case DialogType.warning:
        return Icons.warning;
      case DialogType.info:
        return Icons.info;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 32,
            spreadRadius: 0,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: _primaryColor.withValues(alpha: 0.08),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: Column(
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: _primaryColor.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Icon(
                      _icon,
                      size: 36,
                      color: _primaryColor,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: _primaryColor,
                    height: 1.3,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
            child: Text(
              message,
              style: const TextStyle(
                fontSize: 15,
                color: Color(0xFF4B5563),
                height: 1.5,
                fontWeight: FontWeight.w400,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
            child: Row(
              children: [
                if (secondaryButtonText != null) ...[
                  Expanded(
                    child: SizedBox(
                      height: 48,
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                          onSecondaryButtonTap?.call();
                        },
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(
                            color: Colors.grey.shade300,
                            width: 1.5,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          backgroundColor: Colors.white,
                        ),
                        child: Text(
                          secondaryButtonText!,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF4B5563),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                        onPrimaryButtonTap?.call();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      child: Text(
                        primaryButtonText,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}