import { useState, useEffect } from "react";
import { checkId } from "@/functions/apis/member";

export function useCheckId(id: string) {
  const [checked, setChecked] = useState(false); // ID 중복 체크 여부
  const [available, setAvailable] = useState(false); // ID 사용가능여부
  const [message, setMessage] = useState(""); // ID 중복 체크 메시지
  const [loading, setLoading] = useState(false); // ID 중복 체크 로딩 여부

  useEffect(() => {
    setChecked(false);
    setAvailable(false);
    setMessage("");
  }, [id]);

  const validateIdFormat = () => {
    if (!id || !id.trim()) return "아이디를 입력해주세요!";
    if (id.length < 4) return "아이디는 최소 4자 이상!";
    if (!/^[a-zA-Z0-9_]+$/.test(id)) return "영문, 숫자, 밑줄만 가능!";
    return null;
  };

  const handleCheck = async () => {
    const validationError = validateIdFormat();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await checkId(id);
      setChecked(true);
      setAvailable(result.available);
      setMessage(result.message || '');
    } catch (err) {
      alert("ID 중복 체크 실패");
    } finally {
      setLoading(false);
    }
  };

  return {
    checked,
    available,
    message,
    loading,
    handleCheck,
  };
}