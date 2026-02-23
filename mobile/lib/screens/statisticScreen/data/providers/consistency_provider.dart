import 'package:flutter/material.dart';
import '../../../../services/auth_service.dart';
import '../models/daily_consistency.dart';
import '../repositories/habit_repository.dart';

class ConsistencyProvider extends ChangeNotifier {
  final HabitRepository _repository = HabitRepository(AuthService());

  List<HabitDay>? _data;
  bool _isLoading = false;
  String? _error; // Added for error handling

  List<HabitDay>? get data => _data;
  bool get isLoading => _isLoading;
  String? get error => _error;

  ConsistencyProvider() {
    fetchConsistency();
  }

  Future<void> fetchConsistency() async {
    _isLoading = true;
    _error = null; // Reset error before fetching
    notifyListeners();

    try {
      final now = DateTime.now();
      _data = await _repository.getConsistencyData(
        startDate: DateTime(now.year, 1, 1),
        endDate: DateTime(now.year, 12, 31),
      );
    } catch (e) {
      // Parse the backend error message
      _error = _parseError(e);
      debugPrint("Consistency Error: $_error");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  String _parseError(dynamic e) {
    String message = e.toString();
    if (message.startsWith('Exception:')) {
      message = message.replaceFirst('Exception:', '').trim();
    }
    if (message.toLowerCase().contains('socketexception')) {
      return "Network error: Please check your connection.";
    }
    return message;
  }
}