import mysql from 'mysql2/promise';

// 데이터베이스 연결 설정
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2525',
  database: process.env.DB_NAME || 'artfind_dev',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 데이터베이스 연결 풀 생성
export const pool = mysql.createPool(dbConfig);

// 단일 연결 생성 (트랜잭션용)
export const createConnection = () => mysql.createConnection(dbConfig);

// 연결 테스트 함수
export const testConnection = async () => {
  try {
    const connection = await createConnection();
    await connection.execute('SELECT 1');
    await connection.end();
    return { success: true, message: '데이터베이스 연결 성공' };
  } catch (error) {
    return { 
      success: false, 
      message: '데이터베이스 연결 실패', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

type QueryParam = string | number | boolean | null | Date;
// 데이터베이스 쿼리 실행 헬퍼 함수
export const executeQuery = async (query: string, params: QueryParam[] = []) => {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
};

// 트랜잭션 실행 헬퍼 함수
export const executeTransaction = async (queries: Array<{ query: string; params?: QueryParam[] }>) => {
  const connection = await createConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params = [] } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
};
