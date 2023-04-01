import * as THREE from 'three'

// 材质
const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
// 顶点数据
const points = []
points.push(new THREE.Vector3(-10, 0, 0))
points.push(new THREE.Vector3(0, 10, 0))
points.push(new THREE.Vector3(10, 0, 0))
const geometry = new THREE.BufferGeometry().setFromPoints(points)

const line = () => {
	const line = new THREE.Line(geometry, material)

	return {
		obj: line
	}
}

export default line
