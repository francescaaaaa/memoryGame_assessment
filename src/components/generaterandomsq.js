function generateGreenSq(square, gridSize) {
    const randomIndices = [];
    while (randomIndices.length < square) {
        const randomIndex = Math.floor(Math.random() * gridSize) + 1;
        if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
        }
    }
    return randomIndices;
}

export default generateGreenSq;