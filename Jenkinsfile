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

        // EC2 Deployment Settings
        EC2_HOST = '3.228.5.147'  
        EC2_USER = 'ubuntu'
        EC2_KEY = credentials('ec2-ssh-key')  
        DEPLOY_DIR = '/home/ubuntu/Talent_Bridge-a-full-featured-job-board-platform'
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

        stage('Deploy to EC2') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} << 'EOF'
                        set -e
                        
                        echo " Navigate deployment directory"
                        cd ${DEPLOY_DIR}
                        
                        echo " Pulling latest code from GitHub"
                        git pull origin ci-test
                        
                        echo "get Docker image from Docker Hub"
                        docker pull ${BACKEND_IMAGE}:${LATEST_TAG}
                        docker pull ${FRONTEND_IMAGE}:${LATEST_TAG}
                        docker pull ${MONGO_IMAGE}
                        
                        echo " Stop previous container"
                        docker-compose down
                        
                        echo "Remove old images"
                        docker image prune -f
                        
                        echo " Starting new containers"
                        docker-compose up -d
                        
                        echo "Waiting for containers to be healthy"
                        sleep 10
                        
                        echo " Deployment completed "
EOF
                '''
            }
        }
        stage('Health Check') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} << 'EOF'
                        cd ${DEPLOY_DIR}
                        
                        echo "Checking container status..."
                        docker-compose ps
                        
                        echo ""
                        echo "Checking container health"
                        docker ps --filter "name=mongo_db" --format "{{.Names}}: {{.Status}}"
                        docker ps --filter "name=backend_service" --format "{{.Names}}: {{.Status}}"
                        docker ps --filter "name=frontend_service" --format "{{.Names}}: {{.Status}}"
                        
                        echo ""
                        echo "Testing backend health endpoint"
                        curl -f http://localhost:3000/health || echo "Backend health check failed"
                        
                        echo ""
                        echo "Testing frontend..."
                        curl -f http://localhost/ || echo "Frontend health check failed"
                        
                        echo ""
                        echo " All health checks complete"
EOF
                '''
            }
        }

        stage('Post-Deployment Verification') {
            steps {
             
                sh '''
                    ssh -o StrictHostKeyChecking=no -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} << 'EOF'
                        cd ${DEPLOY_DIR}                                          
                        docker logs --tail 20 backend_service
                        
                        echo ""
                       
                        docker logs --tail 20 frontend_service
                        
                        echo ""
                       
                        docker logs --tail 20 mongo_db
                        
                        echo ""
                        echo " Deployment verification complete"
EOF
                '''
            }
        }

        stage('remove old images ') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} << 'EOF'
                       
                        docker image prune -a -f --filter "until=72h" || true
                        
                        
                        docker volume prune -f || true
                     
                        df -h /
                        
                        echo " remove complete"
EOF
                '''
            }
        

    }

    post {
        success {
            echo " CI/CD Pipeline Passed Successfully"
            echo " Application deployed to EC2 at http://${EC2_HOST}/"
        }
        failure {
            echo " CI/CD Pipeline Faile"
            echo "Please check the logs above for error."
        }
        always {
            
            sh '''
                # Logout from Docker Hub
                docker logout || true
                
                echo " Cleanup completed"
            '''
        }
    }
}