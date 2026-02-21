import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../services/auth_service.dart';
import '../models/daily_consistency.dart';
import '../repositories/habit_repository.dart';

final consistencyDataProvider =
FutureProvider<List<HabitDay>>((ref) async {
  final repository = HabitRepository(AuthService());

  final now = DateTime.now();
  final startOfYear = DateTime(now.year, 1, 1);
  final endOfYear = DateTime(now.year, 12, 31);

  return repository.getConsistencyData(
    startDate: startOfYear,
    endDate: endOfYear,
  );
});
