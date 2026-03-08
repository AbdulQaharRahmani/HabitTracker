import '../../../../services/auth_service.dart';
import '../models/daily_consistency.dart';

class HabitRepository {
  final AuthService _service;

  HabitRepository(this._service);

  Future<List<HabitDay>> getConsistencyData({
    required DateTime startDate,
    required DateTime endDate,
  }) {
    return _service.fetchConsistencyYear(
      startDate: startDate,
      endDate: endDate,
    );
  }
}
