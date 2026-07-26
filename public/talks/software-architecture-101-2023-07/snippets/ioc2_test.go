package main_test

func TestRepository(t *testing.T) {
	// Arrange
	// ...
	db := sql.NewDBConnection()
	repo := NewRepository(db)

	// Act
    data, err := repo.Get()

	// Assert
    require.NoError(t, err)
}