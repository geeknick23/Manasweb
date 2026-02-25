
class ProgramModel {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final int order;
  final bool isActive;

  ProgramModel({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.order,
    required this.isActive,
  });

  factory ProgramModel.fromJson(Map<String, dynamic> json) {
    return ProgramModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      order: json['order'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }
}

class ProjectModel {
  final String id;
  final String title;
  final String description;
  final List<String> highlights;
  final String icon;
  final String color;
  final int order;
  final bool isActive;

  ProjectModel({
    required this.id,
    required this.title,
    required this.description,
    required this.highlights,
    required this.icon,
    required this.color,
    required this.order,
    required this.isActive,
  });

  factory ProjectModel.fromJson(Map<String, dynamic> json) {
    return ProjectModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      highlights: List<String>.from(json['highlights'] ?? []),
      icon: json['icon'] ?? 'star',
      color: json['color'] ?? '#6366f1',
      order: json['order'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }
}

class ContactInfoModel {
  final String phone;
  final String email;
  final String address;
  final double latitude;
  final double longitude;
  final List<OfficeHourModel> officeHours;

  ContactInfoModel({
    required this.phone,
    required this.email,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.officeHours,
  });

  factory ContactInfoModel.fromJson(Map<String, dynamic> json) {
    return ContactInfoModel(
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
      address: json['address'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      officeHours: (json['officeHours'] as List<dynamic>?)
              ?.map((e) => OfficeHourModel.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class OfficeHourModel {
  final String day;
  final String hours;

  OfficeHourModel({required this.day, required this.hours});

  factory OfficeHourModel.fromJson(Map<String, dynamic> json) {
    return OfficeHourModel(
      day: json['day'] ?? '',
      hours: json['hours'] ?? '',
    );
  }
}

class DonateInfoModel {
  final String bankName;
  final String accountName;
  final String accountNumber;
  final String ifscCode;
  final String upiId;
  final String taxExemptionNote;
  final String headerTitle;
  final String headerSubtitle;

  DonateInfoModel({
    required this.bankName,
    required this.accountName,
    required this.accountNumber,
    required this.ifscCode,
    required this.upiId,
    required this.taxExemptionNote,
    required this.headerTitle,
    required this.headerSubtitle,
  });

  factory DonateInfoModel.fromJson(Map<String, dynamic> json) {
    return DonateInfoModel(
      bankName: json['bankName'] ?? '',
      accountName: json['accountName'] ?? '',
      accountNumber: json['accountNumber'] ?? '',
      ifscCode: json['ifscCode'] ?? '',
      upiId: json['upiId'] ?? '',
      taxExemptionNote: json['taxExemptionNote'] ?? '',
      headerTitle: json['headerTitle'] ?? 'Support Our Cause',
      headerSubtitle: json['headerSubtitle'] ?? 'Your contribution helps us create more meaningful connections',
    );
  }
}

class MilestoneModel {
  final String id;
  final String date;
  final String title;
  final String description;
  final int order;
  final bool isActive;

  MilestoneModel({
    required this.id,
    required this.date,
    required this.title,
    required this.description,
    required this.order,
    required this.isActive,
  });

  factory MilestoneModel.fromJson(Map<String, dynamic> json) {
    return MilestoneModel(
      id: json['_id'] ?? '',
      date: json['date'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      order: json['order'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }
}

class VolunteerRoleModel {
  final String id;
  final String title;
  final String description;
  final String icon;
  final int order;
  final bool isActive;

  VolunteerRoleModel({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.order,
    required this.isActive,
  });

  factory VolunteerRoleModel.fromJson(Map<String, dynamic> json) {
    return VolunteerRoleModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      icon: json['icon'] ?? 'star',
      order: json['order'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }
}
