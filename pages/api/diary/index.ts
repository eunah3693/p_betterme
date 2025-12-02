import { NextApiRequest, NextApiResponse } from 'next';
import { DiaryService } from '@/services/diaryService';
import { DiaryResponse, DiaryListResponse } from '@/interfaces/diary';
import { withErrorHandler, validateMethod } from '@/lib/api';

const diaryService = new DiaryService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiaryResponse | DiaryListResponse | { error: string }>
) {
  if (!validateMethod(req, ['GET', 'POST', 'PUT', 'DELETE'])) {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      success: false, 
      data: [] 
    });
  }

  switch (req.method) {
    case 'GET':
      return await getDiaries(req, res);
    case 'POST':
      return await registerDiary(req, res);
    case 'PUT':
      return await updateDiary(req, res);
    case 'DELETE':
      return await deleteDiary(req, res);
  }
}

export default withErrorHandler(handler);

// 일기 조회 (전체 또는 특정)
async function getDiaries(
  req: NextApiRequest,
  res: NextApiResponse<DiaryResponse | DiaryListResponse>
) {
  const { idx } = req.query;

  // 특정 일기 조회
  if (idx) {
    const result = await diaryService.getDiaryByIdx(Number(idx));
    return res.status(200).json(result);
  }

  // 전체 일기 조회
  const result = await diaryService.getAllDiaries();
  return res.status(200).json(result);
}

// 일기 등록
async function registerDiary(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { memberId, subject, content, date } = req.body;

  if (!memberId || !subject || !content) {
    return res.status(400).json({ 
      error: 'memberId, subject, content는 필수입니다',
      success: false,
      data: []
    });
  }

  const result = await diaryService.registerDiary({
    memberId,
    subject,
    content,
    date: date ? new Date(date) : new Date()
  });

  return res.status(201).json({ 
    success: true, 
    data: result,
    message: '일기가 등록되었습니다.'
  });
}

// 일기 수정
async function updateDiary(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idx, subject, content, date } = req.body;

  if (!idx) {
    return res.status(400).json({ 
      error: 'idx는 필수입니다',
      success: false,
      data: []
    });
  }

  const updateData: {
    subject?: string;
    content?: string;
    date?: Date;
  } = {};

  if (subject) updateData.subject = subject;
  if (content) updateData.content = content;
  if (date) updateData.date = new Date(date);

  const result = await diaryService.updateDiary(Number(idx), updateData);

  return res.status(200).json({ 
    success: true, 
    data: result,
    message: '일기가 수정되었습니다.'
  });
}

// 일기 삭제
async function deleteDiary(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idx } = req.query;

  if (!idx) {
    return res.status(400).json({ 
      error: 'idx는 필수입니다',
      success: false,
      data: []
    });
  }

  await diaryService.deleteDiary(Number(idx));

  return res.status(200).json({ 
    success: true, 
    data: [],
    message: '일기가 삭제되었습니다.' 
  });
}

