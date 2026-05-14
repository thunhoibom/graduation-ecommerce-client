"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash, MapPin } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAddressBook,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/services/rest-api/address-book";
import {
  getGhnProvinces,
  getGhnDistricts,
  getGhnWards,
  type GhnProvince,
  type GhnDistrict,
  type GhnWard,
} from "@/services/rest-api/checkout/checkout";
import type { AddressBookPojo } from "@/types/person";

type AddressFormState = {
  label: string;
  firstLine: string;
  municipality: string;
  city: string;
  postalCode: string;
  notes: string;
  defaultShipping: boolean;
  provinceId?: number;
  districtId?: number;
  wardCode: string;
};

const emptyForm = (): AddressFormState => ({
  label: "",
  firstLine: "",
  municipality: "",
  city: "",
  postalCode: "",
  notes: "",
  defaultShipping: false,
  provinceId: undefined,
  districtId: undefined,
  wardCode: "",
});

export function AddressList() {
  const [addresses, setAddresses] = useState<AddressBookPojo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressFormState>(emptyForm);
  const [ghnLoading, setGhnLoading] = useState(false);
  const [ghnProvinces, setGhnProvinces] = useState<GhnProvince[]>([]);
  const [ghnDistricts, setGhnDistricts] = useState<GhnDistrict[]>([]);
  const [ghnWards, setGhnWards] = useState<GhnWard[]>([]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddressBook();
      setAddresses(data);
    } catch {
      toast.error("Không thể tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    setGhnLoading(true);
    getGhnProvinces()
      .then(setGhnProvinces)
      .catch(() => toast.error("Không tải được tỉnh/thành GHN"))
      .finally(() => setGhnLoading(false));
  }, []);

  useEffect(() => {
    if (!showForm) {
      return;
    }
    if (!formData.provinceId) {
      setGhnDistricts([]);
      return;
    }
    getGhnDistricts(formData.provinceId)
      .then(setGhnDistricts)
      .catch(() => toast.error("Không tải được quận/huyện GHN"));
  }, [showForm, formData.provinceId]);

  useEffect(() => {
    if (!showForm) {
      return;
    }
    if (!formData.districtId) {
      setGhnWards([]);
      return;
    }
    getGhnWards(formData.districtId)
      .then(setGhnWards)
      .catch(() => toast.error("Không tải được phường/xã GHN"));
  }, [showForm, formData.districtId]);

  useEffect(() => {
    if (
      !showForm ||
      !editingId ||
      !formData.districtId ||
      formData.provinceId ||
      ghnProvinces.length === 0
    ) {
      return;
    }

    let cancelled = false;
    const resolveProvince = async () => {
      const cityMatch = ghnProvinces.find((p) => p.provinceName === formData.city);
      const candidates = cityMatch ? [cityMatch] : ghnProvinces;

      for (const province of candidates) {
        try {
          const districts = await getGhnDistricts(province.provinceId);
          if (cancelled) {
            return;
          }
          if (districts.some((d) => d.districtId === formData.districtId)) {
            setFormData((current) => ({
              ...current,
              provinceId: province.provinceId,
              city: province.provinceName,
            }));
            setGhnDistricts(districts);
            return;
          }
        } catch {
          // try next province
        }
      }
    };

    void resolveProvince();
    return () => {
      cancelled = true;
    };
  }, [
    showForm,
    editingId,
    formData.districtId,
    formData.provinceId,
    formData.city,
    ghnProvinces,
  ]);

  const resetForm = () => {
    setFormData(emptyForm());
    setGhnDistricts([]);
    setGhnWards([]);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.firstLine.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }
    if (!formData.districtId || !formData.wardCode) {
      toast.error("Vui lòng chọn Quận/Huyện và Phường/Xã từ danh mục GHN");
      return;
    }

    const payload: AddressBookPojo = {
      label: formData.label || "Địa chỉ",
      defaultShipping: formData.defaultShipping,
      address: {
        firstLine: formData.firstLine,
        municipality: formData.municipality,
        city: formData.city,
        postalCode: formData.postalCode || undefined,
        notes: formData.notes || undefined,
        districtId: formData.districtId,
        wardCode: formData.wardCode,
      },
    };

    try {
      if (editingId) {
        const updated = await updateAddress(editingId, payload);
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        const created = await addAddress(payload);
        setAddresses((prev) => [...prev, created]);
        toast.success("Thêm địa chỉ thành công");
      }
      resetForm();
    } catch {
      toast.error("Không thể lưu địa chỉ");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Xoá địa chỉ thành công");
    } catch {
      toast.error("Không thể xoá địa chỉ");
    }
  };

  const handleEdit = (addr: AddressBookPojo) => {
    setFormData({
      label: addr.label ?? "",
      firstLine: addr.address?.firstLine ?? "",
      municipality: addr.address?.municipality ?? "",
      city: addr.address?.city ?? "",
      postalCode: addr.address?.postalCode ?? "",
      notes: addr.address?.notes ?? "",
      defaultShipping: addr.defaultShipping ?? false,
      provinceId: undefined,
      districtId: addr.address?.districtId,
      wardCode: addr.address?.wardCode ?? "",
    });
    setEditingId(addr.id ?? null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-neutral-500" />
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
            Địa chỉ giao hàng
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="gap-1.5 rounded-none"
        >
          <Plus className="size-3.5" />
          Thêm địa chỉ
        </Button>
      </div>

      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <MapPin className="size-10 text-neutral-200 dark:text-neutral-800" />
          <p className="text-sm text-neutral-500">Chưa có địa chỉ nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between rounded-none border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {addr.label ?? "Địa chỉ"}
                  </p>
                  {addr.defaultShipping && (
                    <span className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-500 dark:border-neutral-700">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  {[addr.address?.firstLine, addr.address?.municipality, addr.address?.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <button
                  onClick={() => handleEdit(addr)}
                  className="p-2 text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
                  aria-label="Sửa địa chỉ"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => addr.id && handleDelete(addr.id)}
                  className="p-2 text-neutral-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
                  aria-label="Xóa địa chỉ"
                >
                  <Trash className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="space-y-4 rounded-none border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {editingId ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Nhãn (tuỳ chọn)</Label>
              <Input
                placeholder="VD: Nhà riêng, Công ty"
                value={formData.label}
                onChange={(e) => setFormData((d) => ({ ...d, label: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Địa chỉ *</Label>
              <Input
                placeholder="Số nhà, tên đường"
                value={formData.firstLine}
                onChange={(e) => setFormData((d) => ({ ...d, firstLine: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="provinceId">Tỉnh / Thành phố *</Label>
              <Select
                value={formData.provinceId ? String(formData.provinceId) : undefined}
                onValueChange={(value) => {
                  const provinceId = Number(value);
                  const provinceName =
                    ghnProvinces.find((p) => p.provinceId === provinceId)?.provinceName ?? "";
                  setFormData((d) => ({
                    ...d,
                    provinceId,
                    city: provinceName,
                    districtId: undefined,
                    wardCode: "",
                    municipality: "",
                  }));
                }}
                disabled={ghnLoading}
              >
                <SelectTrigger id="provinceId" className="h-10 w-full rounded-none px-3 text-sm">
                  <SelectValue placeholder="Chọn tỉnh/thành" />
                </SelectTrigger>
                <SelectContent>
                  {ghnProvinces.map((p) => (
                    <SelectItem key={p.provinceId} value={String(p.provinceId)}>
                      {p.provinceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="districtId">Quận / Huyện *</Label>
              <Select
                value={formData.districtId ? String(formData.districtId) : undefined}
                onValueChange={(value) => {
                  const districtId = Number(value);
                  const districtName =
                    ghnDistricts.find((d) => d.districtId === districtId)?.districtName ?? "";
                  setFormData((d) => ({
                    ...d,
                    districtId,
                    municipality: districtName,
                    wardCode: "",
                  }));
                }}
                disabled={!formData.provinceId}
              >
                <SelectTrigger id="districtId" className="h-10 w-full rounded-none px-3 text-sm">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {ghnDistricts.map((d) => (
                    <SelectItem key={d.districtId} value={String(d.districtId)}>
                      {d.districtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wardCode">Phường / Xã *</Label>
              <Select
                value={formData.wardCode || undefined}
                onValueChange={(value) => setFormData((d) => ({ ...d, wardCode: value }))}
                disabled={!formData.districtId}
              >
                <SelectTrigger id="wardCode" className="h-10 w-full rounded-none px-3 text-sm">
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {ghnWards.map((w) => (
                    <SelectItem key={w.wardCode} value={w.wardCode}>
                      {w.wardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Mã bưu điện</Label>
              <Input
                placeholder="700000"
                value={formData.postalCode}
                onChange={(e) => setFormData((d) => ({ ...d, postalCode: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ghi chú</Label>
              <Input
                placeholder="Ghi chú giao hàng"
                value={formData.notes}
                onChange={(e) => setFormData((d) => ({ ...d, notes: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={formData.defaultShipping}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, defaultShipping: e.target.checked }))
                  }
                  className="accent-neutral-900"
                />
                Đặt làm địa chỉ giao hàng mặc định
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} size="sm" className="rounded-none">
              {editingId ? "Cập nhật" : "Thêm địa chỉ"}
            </Button>
            <Button variant="outline" size="sm" onClick={resetForm} className="rounded-none">
              Huỷ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
