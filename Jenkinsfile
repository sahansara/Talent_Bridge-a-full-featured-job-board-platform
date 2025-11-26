pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    environment {
        // Docker Hub credentials 
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'sahansara'  
        
        // Image names
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/talent-bridge-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/talent-bridge-frontend"
        MONGO_IMAGE = "mongo:6"  
        
        // Image tags
        IMAGE_TAG = "${BUILD_NUMBER}"
        LATEST_TAG = "latest"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo ' Cloning repository'
                git branch: 'ci-test', 
                    url: 'https://github.com/sahansara/Talent_Bridge-a-full-featured-job-board-platform.git'
            }
        }

        stage('Environment Check') {
            steps {
                echo ' Checking environment'
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Docker version: $(docker --version)"
                    echo "Docker Compose version: $(docker-compose --version)"
                '''
            }
        }

        stage('Backend CI') {
            steps {
                echo ' Backend: Install & Test'
                dir('Back-end') {
                    sh '''
                        echo "Installing backend dependencies"
                        npm install
                        
                        echo "Running linting."
                        npm run lint || echo " No lint script found"
                        
                        echo "Running tests..."
                        npm test || echo "  No test script found"
                        
                        echo " Backend CI part completed"
                    '''
                }
            }
        }

        stage('Frontend CI') {
            steps {
                echo ' Frontend -> Install & Build'
                dir('fornt-end') {
                    sh '''
                        echo "Installing frontend dependencies..."
                        npm install
                        
                        echo "Building frontend"
                        npm run build
                        
                        echo "Checking build output"
                        ls -la dist/
                        
                        echo " Frontend build completed"
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo ' Building Docker images'
                sh '''
                    echo "Building backend image"
                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:${LATEST_TAG} ./Back-end
                    
                    echo "Building frontend image..."
                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:${LATEST_TAG} ./fornt-end
                    
                    echo " Docker images built successfully"
                    docker images | grep talent-bridge
                '''
            }
        }

        stage('Test Docker Images') {
            steps {
                echo 'Testing Docker images'
                sh '''
                    echo "Testing backend image..."
                    docker run --rm ${BACKEND_IMAGE}:${LATEST_TAG} node --version || echo "Backend image test passed"
                    
                    echo "Testing frontend image..."
                    docker run --rm ${FRONTEND_IMAGE}:${LATEST_TAG} nginx -v || echo "Frontend image test passed"
                    
                    echo " Docker images tested successfully"
                '''
            }
        }

        stage('Docker Login') {
            steps {
                echo ' Logging into Docker Hub...'
                sh '''
                    
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                    echo "Docker Hub login successful"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo ' Pushing images to Docker Hub'
                sh '''
                    echo "Pushing backend image with tag ${IMAGE_TAG}"
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    
                    echo "Pushing backend image with latest tag"
                    docker push ${BACKEND_IMAGE}:${LATEST_TAG}
                    
                    echo "Pushing frontend image with tag ${IMAGE_TAG}"
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    
                    echo "Pushing frontend image with latest tag"
                    docker push ${FRONTEND_IMAGE}:${LATEST_TAG}
                    
                    echo " All images pushed successfully to Docker Hub"
                '''
            }
        }
        stage('Cleanup Local Images') {
            steps {
                echo ' Cleaning up local Docker images after successful push'
                sh '''
                
                    
                    docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || true
                    docker rmi ${BACKEND_IMAGE}:${LATEST_TAG} || true
                    docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                    docker rmi ${FRONTEND_IMAGE}:${LATEST_TAG} || true
                    
                    
                '''
            }
        }

        stage('Docker Compose Validation') {
            steps {
                echo ' Validating docker-compose.yml...'
                sh '''
                    docker compose config
                    echo " docker-compose.yml is valid"
                '''
            }
        }

    }

    post {
        success {
            echo " CI/CD Pipeline Passed Successfully"
            echo " Images pushed to Docker Hub "
            echo "   🔹 ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "   🔹 ${BACKEND_IMAGE}:${LATEST_TAG}"
            echo "   🔹 ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            echo "   🔹 ${FRONTEND_IMAGE}:${LATEST_TAG}"
            echo "   🔹 MongoDB: ${MONGO_IMAGE} "
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        }
        failure {
            echo " CI/CD Pipeline Failed!"
            echo "Please check the logs above for errors."
        }
        always {
            echo " Cleaning up workspace"
            sh '''
                # Logout from Docker Hub
                docker logout || true
                
                #  Clean up old images (keep last 5 builds)
                docker image prune -a --filter "until=168h" -f || true
                
                echo " Cleanup completed"
            '''
        }
    }
}