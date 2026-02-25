import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/constants.dart';

class LocaleCubit extends Cubit<Locale> {
  final SharedPreferences _prefs;

  LocaleCubit(this._prefs) : super(const Locale('mr', 'IN')) {
    _loadSavedLocale();
  }

  void _loadSavedLocale() {
    final savedLocale = _prefs.getString(AppConstants.localeKey);
    if (savedLocale != null) {
      if (savedLocale == 'mr') {
        emit(const Locale('mr', 'IN'));
      } else {
        emit(const Locale('en', 'US'));
      }
    }
  }

  void setLocale(Locale locale) {
    _prefs.setString(AppConstants.localeKey, locale.languageCode);
    emit(locale);
  }

  void setMarathi() {
    setLocale(const Locale('mr', 'IN'));
  }

  void setEnglish() {
    setLocale(const Locale('en', 'US'));
  }

  bool get isMarathi => state.languageCode == 'mr';
  bool get isEnglish => state.languageCode == 'en';
}
