IF NOT EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[calculation_records]')
      AND type = 'U'
)
BEGIN
    CREATE TABLE dbo.calculation_records (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        first_number FLOAT NOT NULL,
        second_number FLOAT NOT NULL,
        operation VARCHAR(255) NOT NULL,
        result FLOAT NOT NULL,
        created_at DATETIME2(7) NOT NULL
    )
END