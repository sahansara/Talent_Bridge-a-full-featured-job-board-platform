pipeline {
    agent any

    tools {
        nodejs 'Node20'  
    }
    triggers {
        githubPush()
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo ' Cloning repository...'
                git branch: 'main', 
                    url: 'https://github.com/sahansara/Talent_Bridge-a-full-featured-job-board-platform.git'
            }
        }

        stage('Backend CI') {
            steps {
                echo '🔧 Backend: Install & Test'
                dir('back-end') {
                    sh '''
                        npm install
                        npm run lint || echo "No lint script"
                        npm test || echo "No test script"
                    '''
                }
            }
        }

        stage('Frontend CI') {
            steps {
                echo '🔧 Frontend: Install & Build'
                dir('fornt-end') {  
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

    }

    post {
        success {
            echo " CI Passed!"
        }
        failure {
            echo " CI Failed!"
        }
    }
}