package main_test

func TestRepository(t *testing.T) {
	// Arrange
	// ...
	db := mock.NewDBConnection()
	repo := NewRepository(db)

	// Act
    data, err := repo.Get()

	// Assert
    require.NoError(t, err)
}