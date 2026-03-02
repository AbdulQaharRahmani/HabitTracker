import 'package:flutter/widgets.dart';

import '../constants/app_breakpoints.dart';

class ResponsiveHelper {
  const ResponsiveHelper._();

  static bool isMobile(BuildContext context) =>
      MediaQuery.sizeOf(context).width <= AppBreakpoints.mobileMax;

  static bool isTablet(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    return width > AppBreakpoints.mobileMax && width <= AppBreakpoints.tabletMax;
  }

  static bool isDesktop(BuildContext context) =>
      MediaQuery.sizeOf(context).width >= AppBreakpoints.desktopMin;

  static int adaptiveGridCount(BuildContext context, {
    int mobile = 1,
    int tablet = 2,
    int desktop = 3,
  }) {
    if (isDesktop(context)) {
      return desktop;
    }
    if (isTablet(context)) {
      return tablet;
    }
    return mobile;
  }

  static double scale(BuildContext context, {
    double mobile = 1,
    double tablet = 1.1,
    double desktop = 1.2,
  }) {
    if (isDesktop(context)) {
      return desktop;
    }
    if (isTablet(context)) {
      return tablet;
    }
    return mobile;
  }
}
