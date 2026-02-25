import 'dart:convert';
import 'dart:io';

import 'package:image_picker/image_picker.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

import '../../core/constants/constants.dart';
import '../datasources/api_client.dart';

class PhotoUploadService {
  final ApiClient _apiClient;

  PhotoUploadService(this._apiClient);

  /// Pick and compress an image, then upload to server
  Future<String?> pickAndUploadPhoto() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (image == null) return null;

    // Compress the image
    final compressedFile = await _compressImage(File(image.path));
    if (compressedFile == null) return null;

    // Upload to server
    return await _uploadPhoto(compressedFile);
  }

  /// Take a photo with camera and upload
  Future<String?> takeAndUploadPhoto() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (image == null) return null;

    final compressedFile = await _compressImage(File(image.path));
    if (compressedFile == null) return null;

    return await _uploadPhoto(compressedFile);
  }

  /// Compress image to reduce file size
  Future<File?> _compressImage(File file) async {
    try {
      final dir = await getTemporaryDirectory();
      final targetPath = path.join(
        dir.path,
        'compressed_${DateTime.now().millisecondsSinceEpoch}.jpg',
      );

      final result = await FlutterImageCompress.compressAndGetFile(
        file.absolute.path,
        targetPath,
        quality: 70,
        minWidth: 800,
        minHeight: 800,
        format: CompressFormat.jpeg,
      );

      return result != null ? File(result.path) : null;
    } catch (e) {
      return file; // Return original if compression fails
    }
  }

  /// Upload photo to backend server
  Future<String?> _uploadPhoto(File file) async {
    try {
      final bytes = await file.readAsBytes();
      final base64Image = base64Encode(bytes);
      final dataUrl = 'data:image/jpeg;base64,$base64Image';

      // Upload as base64 to the profile photo endpoint
      final response = await _apiClient.put(
        ApiConstants.uploadPhoto,
        data: {'profile_photo': dataUrl},
      );

      return response.data['profile_photo'] ?? dataUrl;
    } catch (e) {
      throw Exception('Failed to upload photo: ${e.toString()}');
    }
  }

  /// Upload multiple photos (up to 3)
  Future<List<String>> uploadMultiplePhotos(List<File> files) async {
    final uploadedUrls = <String>[];
    
    for (final file in files.take(3)) {
      final compressedFile = await _compressImage(file);
      if (compressedFile != null) {
        final url = await _uploadPhoto(compressedFile);
        if (url != null) {
          uploadedUrls.add(url);
        }
      }
    }
    
    return uploadedUrls;
  }
}
